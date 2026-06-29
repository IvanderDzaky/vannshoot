'use server';
import { z } from 'zod';
import { headers, cookies } from 'next/headers';

import { auth } from '@/lib/auth';
import type { AuthResponse } from '@/interfaces/features/auth';
import { loginSchema } from '@/schemas/auth';

export type LoginValues = z.infer<typeof loginSchema>;

/**
 * Mapping pesan error Better Auth ke Bahasa Indonesia
 */
const mapAuthError = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  switch (lowerMessage) {
    case 'invalid email or password':
      return 'Email atau password salah.';
    case 'user not found':
      return 'Pengguna tidak ditemukan.';
    case 'email not verified':
      return 'Email Anda belum diverifikasi.';
    case 'too many requests':
      return 'Terlalu banyak percobaan login. Silakan coba lagi nanti.';
    default:
      return 'Terjadi kesalahan saat login. Periksa kembali data Anda.';
  }
};

/**
 * Server Action to handle user login using Better Auth.
 */
export async function loginAction(values: LoginValues): Promise<AuthResponse> {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Data input tidak valid.' };
  }

  try {
    const response = await auth.api.signInEmail({
      body: {
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      },
      headers: await headers(),
      asResponse: true,
    });

    const setCookies = response.headers.getSetCookie();

    if (setCookies.length > 0) {
      const cookieStore = await cookies();

      for (const cookieStr of setCookies) {
        // Parsing manual yang lebih presisi
        const parts = cookieStr.split(';').map((s) => s.trim());
        const [nameValue] = parts;
        const firstEq = nameValue.indexOf('=');
        if (firstEq === -1) continue;

        const name = nameValue.substring(0, firstEq);
        const value = nameValue.substring(firstEq + 1);

        const cookieOptions: any = {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        };

        // Ambil Max-Age dan Expires jika ada
        parts.slice(1).forEach((opt) => {
          const [key, val] = opt.split('=').map((s) => s.trim());
          const lowerKey = key.toLowerCase();
          if (lowerKey === 'max-age') cookieOptions.maxAge = parseInt(val);
          if (lowerKey === 'expires') cookieOptions.expires = new Date(val);
          if (lowerKey === 'domain') cookieOptions.domain = val;
          if (lowerKey === 'samesite') cookieOptions.sameSite = val.toLowerCase() as any;
        });

        // Paksa pengaturan cookie ke store Next.js
        cookieStore.set(name, value, cookieOptions);
      }
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        user: data.user,
        token: data.token,
      },
    };
  } catch (error: Error | unknown) {
    const rawMessage = error instanceof Error ? error.message : '';
    return {
      success: false,
      error: mapAuthError(rawMessage),
    };
  }
}

export async function logoutAction(): Promise<AuthResponse> {
  try {
    const response = await auth.api.signOut({
      headers: await headers(),
      asResponse: true,
    });

    const setCookies = response.headers.getSetCookie();
    if (setCookies.length > 0) {
      const cookieStore = await cookies();
      for (const cookieStr of setCookies) {
        const parts = cookieStr.split(';')[0];
        const firstEq = parts.indexOf('=');
        if (firstEq !== -1) {
          const name = parts.substring(0, firstEq).trim();
          cookieStore.delete(name as any);
        }
      }
    }

    return { success: true };
  } catch (error: Error | unknown) {
    return {
      success: false,
      error: 'Terjadi kesalahan saat keluar dari sistem.',
    };
  }
}
