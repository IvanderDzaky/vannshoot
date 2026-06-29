export interface Article {
  id: string;
  title: string;
  content: string;
  cover: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
  articleCategories: ArticleCategory[];
}

export interface ArticleCategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleResponse {
  success: boolean;
  data?: Article;
  message?: string;
  error?: string;
}

export interface ArticlePaginationResponse {
  success: boolean;
  data: Article[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
  error?: string;
}
