import fs from 'fs';
import path from 'path';

/**
 * Recursively crawl the app directory to find all pages.
 * Handles route groups (e.g., (auth)) by omitting them from the path.
 * Ignores API routes and internal components (folders starting with _).
 */
export function getAppRoutes(baseDir: string = 'src/app'): string[] {
  const absoluteBaseDir = path.resolve(process.cwd(), baseDir);
  const routes: string[] = [];

  function crawl(currentDir: string, currentRoute: string = '') {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        const name = item.name;

        // Ignore internal folders (e.g., _components) and api folder
        if (name.startsWith('_') || name === 'api') continue;

        // Handle route groups: folders in parentheses don't affect the URL
        const nextRouteSegment = name.startsWith('(') && name.endsWith(')') ? '' : name;
        const nextRoute = path.join(currentRoute, nextRouteSegment);

        crawl(path.join(currentDir, name), nextRoute);
      } else if (item.isFile() && (item.name === 'page.tsx' || item.name === 'page.js')) {
        // We found a page!
        // Normalize the route: ensure forward slashes and correct root
        let normalizedRoute = currentRoute.replace(/\\/g, '/');

        if (!normalizedRoute || normalizedRoute === '.') {
          normalizedRoute = '/';
        } else {
          if (!normalizedRoute.startsWith('/')) {
            normalizedRoute = '/' + normalizedRoute;
          }
          if (normalizedRoute.endsWith('/')) {
            normalizedRoute = normalizedRoute.slice(0, -1);
          }
        }

        // Only add if not already present
        if (!routes.includes(normalizedRoute)) {
          routes.push(normalizedRoute);
        }
      }
    }
  }

  if (fs.existsSync(absoluteBaseDir)) {
    crawl(absoluteBaseDir);
  }

  return routes;
}
