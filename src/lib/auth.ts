import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      roleId: {
        type: 'string',
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  session: {
    expiresIn: 60 * 60 * 24, // 1 Day
    freshAge: 0, // Disable auto-renewal for strict testing
    updateAge: 0, // Force update check on every request
  },
  plugins: [admin()],
});
