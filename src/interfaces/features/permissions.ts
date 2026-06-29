export interface Permission {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    roles: number;
    role_has_permissions: number;
    model_has_permissions: number;
  };
}

export interface PermissionResponse {
  success: boolean;
  message?: string;
  data?: Permission | Permission[];
  error?: string;
}

export interface PermissionPaginationResponse {
  success: boolean;
  data: Permission[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
