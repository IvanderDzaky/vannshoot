import type { MetadataRoute } from 'next';

import { siteMetadata } from '@/data/siteMetadata';
import { getAppRoutes } from '@/lib/sitemap';

/** Routes yang dikecualikan dari sitemap (private/auth pages) */
const EXCLUDED_ROUTES = ['/login', '/register'];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl || 'http://localhost:3000';

  const routes = getAppRoutes()
    .filter((route) => {
      // Exclude exact matches (e.g. /login, /register)
      if (EXCLUDED_ROUTES.includes(route)) return false;
      // Exclude /admin and all sub-paths
      if (route === '/admin' || route.startsWith('/admin/')) return false;
      return true;
    })
    .map((route) => ({
      url: `${siteUrl}${route === '/' ? '' : route}`,
      lastModified: new Date().toISOString().split('T')[0],
    }));

  return [...routes];
}
