export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions?: { id: string; name: string }[];
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    users: number;
    permissions: number;
    roleHasPermissions: number;
    modelHasPermissions: number;
  };
}

export interface RoleResponse {
  success: boolean;
  data?: Role;
  message?: string;
  error?: string;
}

export interface RolePaginationResponse {
  success: boolean;
  data: Role[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
