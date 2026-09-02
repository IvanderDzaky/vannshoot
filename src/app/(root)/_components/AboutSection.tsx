const aboutContent = {
  heading: 'Tentang Saya',
  description:
    'Saya mahasiswa Informatika Telkom University Bandung yang fokus pada full-stack web development. Saya terbiasa mengembangkan aplikasi web dari sisi frontend hingga backend, mulai dari membangun antarmuka, mengembangkan API, mengelola autentikasi, hingga mengintegrasikan database. Dalam pengembangan web, saya banyak menggunakan React, Next.js, TypeScript, Tailwind CSS, Node.js, FastAPI, MySQL, dan PostgreSQL. Saya juga terus mendalami UI/UX agar aplikasi yang saya buat tidak hanya berjalan dengan baik, tetapi juga nyaman dan mudah digunakan. Selain pengembangan web, fotografi menjadi ruang kreatif saya untuk menangkap berbagai momen, cerita, dan ekspresi melalui VannShoot.',
};

const heading = aboutContent.heading;
const description = aboutContent.description;

export default function AboutSection() {
  return (
    <section id="about" className="py-12 md:py-16">
      <div className="mx-auto max-w-330 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl font-headline">
            {heading}
          </h2>
          <p className="text-base leading-relaxed text-[#c8c7c4]">{description}</p>
        </div>
      </div>
    </section>
  );
}
