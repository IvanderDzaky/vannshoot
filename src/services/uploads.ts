'use server';

import { writeFile, mkdir, unlink, stat, rename, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import sharp from 'sharp';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

/** Timeout (ms) untuk seluruh proses upload & kompresi sharp */
const UPLOAD_TIMEOUT_MS = 30_000;

/**
 * Wrapper Promise dengan timeout agar proses tidak hang selamanya.
 * Jika melebihi batas waktu, Promise di-reject dengan error yang jelas.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, label = 'Operasi'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} melebihi batas waktu ${ms / 1000}s.`)), ms)
    ),
  ]);
}

/**
 * Upload dan Kompres Gambar
 * Menyimpan ke /public/uploads
 */
export async function uploadImage(
  file: File,
  subDir: string = ''
): Promise<{ success: boolean; url?: string; error?: string }> {
  const startTime = Date.now();
  console.log(
    `[uploadImage] ▶ Mulai upload: "${file.name}" (${(file.size / 1024).toFixed(1)} KB) → subDir: "${subDir || '(root)'}"`
  );

  try {
    console.log(`[uploadImage] 📦 Membaca buffer dari file...`);
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`[uploadImage] ✅ Buffer siap: ${buffer.length} bytes`);

    const uploadDir = join(process.cwd(), 'public', 'uploads', subDir);

    // Pastikan direktori ada
    if (!existsSync(uploadDir)) {
      console.log(`[uploadImage] 📁 Direktori tidak ditemukan, membuat: ${uploadDir}`);
      await mkdir(uploadDir, { recursive: true });
      console.log(`[uploadImage] ✅ Direktori berhasil dibuat`);
    } else {
      console.log(`[uploadImage] 📁 Direktori sudah ada: ${uploadDir}`);
    }

    // Buat nama file unik
    const safeName = slugify(file.name.replace(/\.[^/.]+$/, '')); // strip extension lalu slugify
    const filename = `${Date.now()}-${safeName || 'file'}`;
    const filePath = join(uploadDir, filename);

    // Proses kompresi menggunakan sharp
    // we use .webp for better compression without losing quality
    const compressedFilename = filename.split('.')[0] + '.webp';
    const compressedFilePath = join(uploadDir, compressedFilename);

    console.log(`[uploadImage] 🔧 Memulai kompresi sharp → output: ${compressedFilename}`);

    // Kompresi dengan timeout 30 detik — mencegah hang jika sharp macet
    await withTimeout(
      sharp(buffer)
        .rotate() // Auto-correct EXIF orientation before stripping metadata
        .webp({
          quality: 85,
          effort: 4,
          smartSubsample: true,
        })
        .toFile(compressedFilePath),
      UPLOAD_TIMEOUT_MS,
      'Kompresi gambar'
    );

    const elapsed = Date.now() - startTime;
    const url = join('/uploads', subDir, compressedFilename).replace(/\\/g, '/');

    console.log(`[uploadImage] ✅ Upload selesai dalam ${elapsed}ms → URL: ${url}`);

    return {
      success: true,
      url,
    };
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[uploadImage] ❌ ERROR setelah ${elapsed}ms untuk file "${file.name}":`, error);
    console.error(`[uploadImage] ❌ Error detail:`, {
      name: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, error: 'Gagal mengunggah dan mengompres gambar.' };
  }
}

/**
 * Hapus Gambar dari Filesystem
 */
export async function deleteImage(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!url || !url.startsWith('/uploads/')) {
      return { success: true }; // Abaikan jika bukan file lokal atau url kosong
    }

    const filename = url.replace('/uploads/', '');
    const filePath = join(process.cwd(), 'public', 'uploads', filename);

    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete Image Error:', error);
    return { success: false, error: 'Gagal menghapus file gambar.' };
  }
}

/**
 * Ganti Nama Direktori di public/uploads
 */
export async function renameUploadDir(
  oldSubDir: string,
  newSubDir: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const oldPath = join(process.cwd(), 'public', 'uploads', oldSubDir);
    const newPath = join(process.cwd(), 'public', 'uploads', newSubDir);

    if (existsSync(oldPath)) {
      // Pastikan parent directory tujuan ada
      const newParent = join(newPath, '..');
      if (!existsSync(newParent)) {
        await mkdir(newParent, { recursive: true });
      }

      await rename(oldPath, newPath);
    }

    return { success: true };
  } catch (error) {
    console.error('Rename Upload Dir Error:', error);
    return { success: false, error: 'Gagal mengganti nama direktori penyimpanan.' };
  }
}

/**
 * Hapus Direktori di public/uploads secara rekursif
 */
export async function deleteUploadDir(
  subDir: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const dirPath = join(process.cwd(), 'public', 'uploads', subDir);

    if (existsSync(dirPath)) {
      await rm(dirPath, { recursive: true, force: true });
    }

    return { success: true };
  } catch (error) {
    console.error('Delete Upload Dir Error:', error);
    return { success: false, error: 'Gagal menghapus direktori penyimpanan.' };
  }
}
