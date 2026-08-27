import { Mail, Code, Rss, Share2 } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="border-t border-white/5 bg-[#121619] py-20">
      <div className="mx-auto max-w-330 px-6">
        <div className="grid gap-12 md:grid-cols-4 mb-16">
          <div className="md:col-span-2">
            <div className="text-3xl font-bold text-white font-headline mb-6">Ivander Dzaky</div>
            <p className="max-w-sm text-[#c8c7c4] leading-relaxed">
              I build thoughtful digital experiences and create visual stories through web design
              and photography.
            </p>
            <div className="mt-6 flex gap-4 text-[#c8c7c4]">
              <a
                href="mailto:contact@ivander.dev"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 hover:text-[#fe7f2d]"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 hover:text-[#fe7f2d]"
                aria-label="GitHub"
              >
                <Code size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 hover:text-[#fe7f2d]"
                aria-label="LinkedIn"
              >
                <Share2 size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 hover:text-[#fe7f2d]"
                aria-label="Instagram"
              >
                <Rss size={18} />
              </a>
            </div>
          </div>
          <div>
            <h5 className="mb-6 text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">Navigation</h5>
            <ul className="space-y-4 text-[#c8c7c4]">
              {['Home', 'Portfolio', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a className="hover:text-white transition-colors" href={`#${item.toLowerCase()}`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="mb-6 text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">Socials</h5>
            <ul className="space-y-4 text-[#c8c7c4]">
              {[
                { label: 'Instagram', href: 'https://instagram.com' },
                { label: 'GitHub', href: 'https://github.com' },
                { label: 'LinkedIn', href: 'https://linkedin.com' },
                { label: 'Twitter', href: 'https://twitter.com' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    className="hover:text-white transition-colors"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-[#9da2ab] md:flex-row">
          <p>© 2024 Ivander Dzaky. All Rights Reserved.</p>
          <p>Designed and developed by Ivander Dzaky</p>
        </div>
      </div>
    </footer>
  );
}
