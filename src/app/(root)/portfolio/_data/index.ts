export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  cta: string;
  details?: string;
}

export interface Photo {
  id: string;
  title: string;
  image: string;
  tall?: boolean;
  details?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  cta: string;
  details?: string;
}

export const projects: Project[] = [
  {
    id: 'traffic-ai-monitoring',
    title: 'Traffic AI Monitoring',
    category: 'Development',
    description:
      'Website monitoring dan analisis trafik jaringan berbasis AI untuk membantu memantau kondisi interface jaringan, mendeteksi anomali, dan menyajikan rekomendasi berdasarkan data monitoring.',
    tags: ['PHP', 'JavaScript', 'MySQL', 'Python', 'FastAPI', 'Gemini AI'],
    image: '/assets/img/Traffic_AI_Monitoring_page.jpg',
    cta: 'Lihat Studi Kasus',
    details:
      'Sistem mengolah data monitoring jaringan dan menganalisis metrik seperti utilization, error, discard, down, dan flap menggunakan AI. Hasil analisis diklasifikasikan menjadi Healthy, Warning, atau Critical dan ditampilkan melalui dashboard lengkap dengan riwayat analisis serta fitur Engineer Review.',
  },
];

export const photos: Photo[] = [
  {
    id: 'ducati-panigale',
    title: 'Ducati Panigale',
    image: '/assets/img/IMG_4218.JPG',
    tall: true,
    details:
      'Salah satu momen saat memotret Ducati Panigale di acara gathering komunitas otomotif.',
  },
  {
    id: 'bmw-s1000rr',
    title: 'BMW S1000RR',
    image: '/assets/img/IMG_4217.JPG',
    tall: true,
    details: 'Potret rider bersama BMW S1000RR saat acara gathering komunitas otomotif.',
  },
  {
    id: 'blue-sportbike',
    title: 'Yamaha R15',
    image: '/assets/img/IMG_4216.JPG',
    tall: true,
    details: 'Potret rider dengan Yamaha R15 berwarna biru saat gathering komunitas otomotif.',
  },
  {
    id: 'graduation-day-1',
    title: 'Graduation Day',
    image: '/assets/img/IMG_4215.JPG',
    tall: true,
    details: 'Sesi foto wisuda outdoor dengan suasana yang santai dan natural.',
  },
  {
    id: 'graduation-day-2',
    title: 'Graduation Day',
    image: '/assets/img/IMG_4212.JPG',
    tall: true,
    details: 'Sesi foto wisuda outdoor dengan suasana yang santai dan natural.',
  },
  {
    id: 'graduation-day-3',
    title: 'Graduation Day',
    image: '/assets/img/IMG_4214.JPG',
    tall: true,
    details: 'Sesi foto wisuda outdoor dengan suasana yang santai dan natural.',
  },
  {
    id: 'outdoor-portrait-1',
    title: 'Outdoor Portrait',
    image: '/assets/img/IMG_4209.JPG',
    tall: true,
    details:
      'Sesi foto model outdoor dengan memanfaatkan cahaya alami dan area sekitar sebagai latar.',
  },
  {
    id: 'outdoor-portrait-2',
    title: 'Outdoor Portrait',
    image: '/assets/img/IMG_4210.JPG',
    tall: true,
    details:
      'Sesi foto model outdoor dengan memanfaatkan cahaya alami dan area sekitar sebagai latar.',
  },
  {
    id: 'outdoor-portrait-3',
    title: 'Outdoor Portrait',
    image: '/assets/img/IMG_4211.JPG',
    tall: true,
    details:
      'Sesi foto model outdoor dengan memanfaatkan cahaya alami dan area sekitar sebagai latar.',
  },
];

export const contents: ContentItem[] = [];

export interface CategoryCard {
  id: string;
  title: string;
  description: string;
  image: string;
  path: string;
}

export const categories: CategoryCard[] = [
  {
    id: 'projects',
    title: 'Proyek & Aplikasi',
    description:
      'Pengembangan website, dashboard, dan produk digital yang dibangun dengan teknologi modern serta berfokus pada fungsionalitas dan pengalaman pengguna.',
    image: '/assets/img/Traffic_AI_Monitoring_page.jpg',
    path: '/portfolio/projects',
  },
  {
    id: 'photography',
    title: 'Fotografi',
    description:
      'Kumpulan karya fotografi yang menangkap momen, suasana, dan cerita melalui komposisi visual yang menarik.',
    image: '/assets/img/IMG_4218.JPG',
    path: '/portfolio/photography',
  },
  {
    id: 'contents',
    title: 'Konten Kreatif',
    description:
      'Produksi konten kreatif yang mencakup video, dokumentasi visual, serta berbagai konten digital untuk kebutuhan media sosial.',
    image: '',
    path: '/portfolio/contents',
  },
];
