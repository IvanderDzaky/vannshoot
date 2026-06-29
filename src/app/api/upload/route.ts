import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import sharp from 'sharp';
import { slugify } from '@/lib/slugify';

const UPLOAD_TIMEOUT_MS = 30_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label = 'Operasi'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} melebihi batas waktu ${ms / 1000}s.`)), ms)
    ),
  ]);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const subDir = (formData.get('subDir') as string) || '';

    if (!file) {
      console.error('[API /upload] ❌ Tidak ada file dalam request');
      return NextResponse.json(
        { success: false, error: 'Tidak ada file yang dikirim.' },
        { status: 400 }
      );
    }

    console.log(
      `[API /upload] ▶ Mulai upload: "${file.name}" (${(file.size / 1024).toFixed(1)} KB) → subDir: "${subDir || '(root)'}"`
    );

    if (!file.type.startsWith('image/')) {
      console.warn(`[API /upload] ⚠️ Bukan file gambar: type="${file.type}"`);
      return NextResponse.json(
        { success: false, error: 'File harus berupa gambar.' },
        { status: 400 }
      );
    }

    console.log(`[API /upload] 📦 Membaca buffer dari file...`);
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`[API /upload] ✅ Buffer siap: ${buffer.length} bytes`);

    const uploadDir = join(process.cwd(), 'public', 'uploads', subDir);

    if (!existsSync(uploadDir)) {
      console.log(`[API /upload] 📁 Membuat direktori: ${uploadDir}`);
      await mkdir(uploadDir, { recursive: true });
      console.log(`[API /upload] ✅ Direktori dibuat`);
    } else {
      console.log(`[API /upload] 📁 Direktori sudah ada: ${uploadDir}`);
    }

    const safeName = slugify(file.name.replace(/\.[^/.]+$/, '')); // strip extension lalu slugify
    const filename = `${Date.now()}-${safeName || 'file'}`;
    const compressedFilename = filename.split('.')[0] + '.webp';
    const compressedFilePath = join(uploadDir, compressedFilename);

    console.log(`[API /upload] 🔧 Memulai kompresi sharp → ${compressedFilename}`);

    await withTimeout(
      sharp(buffer)
        .rotate()
        .webp({ quality: 85, effort: 4, smartSubsample: true })
        .toFile(compressedFilePath),
      UPLOAD_TIMEOUT_MS,
      'Kompresi gambar'
    );

    const elapsed = Date.now() - startTime;
    const url = join('/uploads', subDir, compressedFilename).replace(/\\/g, '/');

    console.log(`[API /upload] ✅ Selesai dalam ${elapsed}ms → URL: ${url}`);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[API /upload] ❌ ERROR setelah ${elapsed}ms:`, error);
    console.error(`[API /upload] ❌ Detail:`, {
      name: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { success: false, error: 'Gagal mengunggah dan mengompres gambar.' },
      { status: 500 }
    );
  }
}

// Konfigurasi Next.js agar route ini tidak dibatasi body size default
export const runtime = 'nodejs';
export const maxDuration = 60; // detik, untuk kompresi file besar
