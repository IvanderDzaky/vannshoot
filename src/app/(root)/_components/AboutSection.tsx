export default function AboutSection() {
  return (
    <section id="about" className="py-22">
      <div className="mx-auto max-w-330 px-6">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-white font-headline">About Me</h2>
          <p className="text-lg leading-relaxed text-[#c8c7c4]">
            I am an Informatics student at Telkom University who enjoys building modern web
            applications and creating visual stories through photography. I specialize in frontend
            development while exploring UI/UX design and thoughtful digital experiences.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { label: 'Projects Completed', value: '15+' },
            { label: 'GPA', value: '3.50' },
            { label: 'Photography Sessions', value: '50+' },
            { label: 'Technologies', value: '10+' },
          ].map((item) => (
            <div
              key={item.label}
              className="glass-panel rounded-3xl border border-white/5 p-8 text-center transition-all duration-300 hover:border-[#fe7f2d]/30"
            >
              <h4 className="mb-2 text-5xl font-bold text-[#fe7f2d]">{item.value}</h4>
              <p className="text-sm uppercase tracking-[0.3em] text-[#c8c7c4]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
