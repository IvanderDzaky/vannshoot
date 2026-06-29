import 'better-auth';

declare module 'better-auth' {
  interface User {
    roleId?: string | null;
    role?: string | null;
    roles?: {
      id: string;
      name: string;
    }[];
    permissions?: string[];
  }
  interface Session {
    user: User;
    session: {
      id: string;
      userId: string;
      expiresAt: Date;
      token: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}

declare module 'better-auth/react' {
  interface User {
    roleId?: string | null;
    role?: string | null;
    roles?: {
      id: string;
      name: string;
    }[];
    permissions?: string[];
  }
  interface Session {
    user: User;
    session: {
      id: string;
      userId: string;
      expiresAt: Date;
      token: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}
