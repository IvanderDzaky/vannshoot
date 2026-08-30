import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Route } from 'next';
import type { Project } from '../_data';

interface Props {
  project: Project;
}

const ProjectGridItem: FC<Props> = ({ project }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111419] shadow-[0_24px_80px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-2 flex flex-col">
      <div className="aspect-video overflow-hidden relative">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={80}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-10 rounded-full bg-[#111419]/80 backdrop-blur-xs px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#afcade] border border-white/5">
          {project.category}
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-[#fe7f2d] transition-colors duration-300">
            {project.title}
          </h3>
          <p className="mb-6 text-sm leading-7 text-[#c8c7c4] line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#3d4652]/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#c8c7c4]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div>
          <Link
            href={`/portfolio/projects/${project.id}` as Route}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#fe7f2d] hover:underline transition-colors duration-300"
          >
            {project.cta} →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectGridItem;
