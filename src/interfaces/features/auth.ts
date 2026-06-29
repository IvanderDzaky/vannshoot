export interface User {
  id: string;
  email: string;
  name?: string | null;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
  roleId?: string | null;
}

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  impersonatedBy: string | null;
}

export interface Account {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    session?: Session;
    token?: string;
  };
  error?: string;
}
