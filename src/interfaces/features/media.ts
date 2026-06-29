export interface Media {
  id: string;
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
  extension: string;
  folder: string;
  isTrashed: boolean;
  deletedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface MediaMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MediaResponse {
  success: boolean;
  data: Media[];
  meta: MediaMeta;
  message?: string;
  error?: string;
}

export interface SingleMediaResponse {
  success: boolean;
  data?: Media;
  message?: string;
  error?: string;
}

export interface MediaValues {
  name?: string;
  folder?: string;
}
