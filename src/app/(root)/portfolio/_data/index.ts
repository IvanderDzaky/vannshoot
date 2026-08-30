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
    id: "traffic-ai-monitoring",
    title: "Traffic AI Monitoring",
    category: "Development",
    description:
      "Website monitoring dan analisis trafik jaringan berbasis AI untuk membantu memantau kondisi interface jaringan, mendeteksi anomali, dan menyajikan rekomendasi berdasarkan data monitoring.",
    tags: ["PHP", "JavaScript", "MySQL", "Python", "FastAPI", "Gemini AI"],
    image: "/assets/img/Traffic_AI_Monitoring_page.jpg",
    cta: "View Case Study",
    details:
      "Sistem mengolah data monitoring jaringan dan menganalisis metrik seperti utilization, error, discard, down, dan flap menggunakan AI. Hasil analisis diklasifikasikan menjadi Healthy, Warning, atau Critical dan ditampilkan melalui dashboard lengkap dengan riwayat analisis serta fitur Engineer Review.",
  },
];

export const photos: Photo[] = [];

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
    id: "projects",
    title: "Projects",
    description: "Website development, dashboards, dan digital products engineered with code.",
    image: "/assets/img/Traffic_AI_Monitoring_page.jpg",
    path: "/portfolio/projects",
  },
  {
    id: "photography",
    title: "Photography",
    description: "Cinematic visual stories capturing urban landscapes dan portraits.",
    image: "",
    path: "/portfolio/photography",
  },
  {
    id: "contents",
    title: "Contents",
    description: "Creative digital production, video content, dan social media campaigns.",
    image: "",
    path: "/portfolio/contents",
  },
];