'use server';

import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function updateUserEmail(
  newEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: 'Sesi tidak valid.' };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { success: false, error: 'Pengguna tidak ditemukan.' };
    }

    // Check if new email is already in use by another user
    const emailExists = await prisma.user.findUnique({
      where: { email: newEmail.toLowerCase() },
    });

    if (emailExists) {
      return { success: false, error: 'Email tersebut sudah digunakan oleh pengguna lain.' };
    }

    // Update email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: newEmail.toLowerCase(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Update User Email Error:', error);
    return { success: false, error: 'Gagal memperbarui email karena kesalahan server.' };
  }
}
