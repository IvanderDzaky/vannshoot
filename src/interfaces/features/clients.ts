export interface Client {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  categories: ClientCategory[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    categories: number;
  };
}

export interface ClientCategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientResponse {
  success: boolean;
  data?: Client;
  error?: string;
  message?: string;
}

export interface ClientPaginationResponse {
  success: boolean;
  data: Client[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
  error?: string;
}
