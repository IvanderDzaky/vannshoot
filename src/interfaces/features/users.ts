import type { Role } from './roles';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  roleId?: string | null;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  success: boolean;
  data?: User;
  error?: string;
  message?: string;
}

export interface UserPaginationResponse {
  success: boolean;
  data: User[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
