export interface PortfolioCategory {
  id: string;
  title: string;
  description: string | null;
  cover: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioCategoryResponse {
  success: boolean;
  data?: PortfolioCategory | PortfolioCategory[];
  message?: string;
  error?: string;
}

export interface PortfolioCategoryPaginationResponse {
  success: boolean;
  data: PortfolioCategory[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
  error?: string;
}
