import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { projects } from '@/app/(root)/portfolio/_data';

const portfolioContent = {
  breadcrumb: "Portofolio",
  heading: "Karya Terpilih",
  cta: "Lihat Semua Proyek",
};

const breadcrumb = portfolioContent.breadcrumb;
const heading = portfolioContent.heading;
const cta = portfolioContent.cta;

export default function PortfolioSection() {
  const featuredProjects = projects.slice(0, 4);

  return (
    <section id="portfolio" className="py-12 md:py-16">
      <div className="mx-auto max-w-330 px-6">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="block text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">
              {breadcrumb}
            </span>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl font-headline">{heading}</h2>
          </div>
          <Link
            className="inline-flex items-center gap-2 text-sm text-[#c8c7c4] transition hover:text-[#fe7f2d]"
            href={'/portfolio' as Route}
          >
            {cta}
            <ArrowRight size={16} className="flex-shrink-0" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <Link key={project.id} href={`/portfolio/projects/${project.id}` as Route} className="group block">
              <div className="relative mb-4 overflow-hidden rounded-2xl border border-white/5 bg-[#111419] aspect-video">
                <img
                  loading="lazy"
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#fe7f2d] transition-colors">{project.title}</h3>
                  <p className="mb-3 text-sm leading-relaxed text-[#c8c7c4]">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#c8c7c4]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
