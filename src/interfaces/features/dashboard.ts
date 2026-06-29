export interface DashboardStats {
  counts: {
    portfolios: number;
    portfolioCategories: number;
    testimonials: number;
    clients: number;
    clientCategories: number;
    orders: number;
    users: number;
    roles: number;
  };
  recentPortfolios: Array<{
    id: string;
    title: string;
    cover: string | null;
    city: string | null;
    createdAt: Date;
    categories: Array<{ id: string; title: string }>;
  }>;
  portfolioCategoryDistribution: Array<{
    id: string;
    title: string;
    count: number;
    percentage: number;
  }>;
}
