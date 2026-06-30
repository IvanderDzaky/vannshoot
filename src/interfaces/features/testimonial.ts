export interface Testimonial {
  id: string;
  cover: string | null;
  client: string;
  testimony: string;
  location: string;
  city: string;
  redirect: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialResponse {
  success: boolean;
  data?: Testimonial;
  message?: string;
  error?: string;
}

export interface TestimonialPaginationResponse {
  success: boolean;
  data: Testimonial[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
  error?: string;
}
