import type { PortfolioCategory } from './portfolio-categories';

export interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  cover: string | null;
  images: string[];
  city: string | null;
  categories: PortfolioCategory[];
  price: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioResponse {
  success: boolean;
  data?: Portfolio | Portfolio[];
  meta?: {
    total: number;
    page: number;
    lastPage: number;
  };
  message?: string;
  error?: string;
}

export interface PortfolioPaginationResponse {
  success: boolean;
  data: Portfolio[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
  error?: string;
}
