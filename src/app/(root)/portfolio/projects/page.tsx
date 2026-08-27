import type { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { genPageMetadata } from '@/app/seo';
import { projects } from '../_data';
import ProjectGridItem from '../_components/ProjectGridItem';

export const metadata = genPageMetadata({
  title: 'Projects Portfolio',
  description: 'Web development, apps, and technical architecture engineered by Vannshoot.',
});

const ProjectsPage: FC = () => {
  return (
    <main className="min-h-screen bg-[#0b0f11] text-[#e0e2e6] py-24 px-6">
      <div className="mx-auto max-w-300 space-y-12">
        {/* Header / Navigation */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/5 pb-8">
          <div className="space-y-4">
            <Link
              href={'/portfolio' as Route}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#fe7f2d] hover:underline"
            >
              ← Back to Hub
            </Link>
            <span className="block text-sm uppercase tracking-[0.28em] text-[#fe7f2d] font-label mt-2">
              Engineering
            </span>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl font-headline">
              Development Projects
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#c8c7c4] md:text-base">
            Web applications, dashboards, and engineering solutions built with modern stacks like React, Next.js, and Three.js.
          </p>
        </div>

        {/* Grid List */}
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectGridItem key={project.id} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProjectsPage;
