const aboutContent = {
  heading: "Tentang Saya",
  description: "Saya mahasiswa Informatika Telkom University Bandung dengan fokus utama pada frontend development. Saya senang membangun website yang tidak hanya berfungsi dengan baik, tetapi juga nyaman dilihat dan digunakan. Saat ini saya banyak bekerja dengan React, Next.js, TypeScript, dan Tailwind CSS sambil terus mendalami UI/UX. Selain dunia teknologi, fotografi menjadi ruang kreatif saya untuk menangkap cerita, momen, dan ekspresi melalui VannShoot.",
};

const heading = aboutContent.heading;
const description = aboutContent.description;

export default function AboutSection() {
  return (
    <section id="about" className="py-12 md:py-16">
      <div className="mx-auto max-w-330 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl font-headline">{heading}</h2>
          <p className="text-base leading-relaxed text-[#c8c7c4]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
