'use server';
import { z } from 'zod';
import { writeFile, mkdir, unlink, rename, stat, readdir, rm } from 'node:fs/promises';
import { join, extname, relative, dirname } from 'node:path';
import { existsSync, createReadStream } from 'node:fs';
import { spawn } from 'node:child_process';
import sharp from 'sharp';
import type { Media, MediaResponse, SingleMediaResponse } from '@/interfaces/features/media';

import { createFolderSchema, moveSchema, renameSchema } from '@/schemas/media';

const UPLOAD_ROOT = join(process.cwd(), 'public', 'uploads');
const TRASH_ROOT = join(UPLOAD_ROOT, '.trash');

export type RenameFormValues = z.infer<typeof renameSchema>;
export type MoveFormValues = z.infer<typeof moveSchema>;
export type CreateFolderFormValues = z.infer<typeof createFolderSchema>;

/**
 * Ensure directories exist
 */
async function ensureDir(path: string) {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
}

/**
 * Create New Folder
 */
export async function createFolder(
  folderName: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const targetDir = join(UPLOAD_ROOT, folderName);
    if (existsSync(targetDir)) {
      return { success: false, error: 'Folder sudah ada.' };
    }

    await mkdir(targetDir, { recursive: true });
    return { success: true, message: `Folder "${folderName}" berhasil dibuat.` };
  } catch (error) {
    console.error('Create Folder Error:', error);
    return { success: false, error: 'Gagal membuat folder.' };
  }
}

/**
 * Get all subfolders in a specific directory
 */
export async function getFolders(
  isTrashed = false,
  folder = '',
  search = '',
  showHidden = false
): Promise<{ success: boolean; data: string[] }> {
  try {
    const targetBase = isTrashed ? TRASH_ROOT : UPLOAD_ROOT;
    const targetDir = join(targetBase, folder);
    await ensureDir(targetDir);

    const folderList: string[] = [];

    const scan = async (dir: string) => {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          // Never show .trash folder in normal folder list
          if (entry.name === '.trash') continue;

          // Handle hidden folders
          if (!showHidden && entry.name.startsWith('.')) continue;

          const fullPath = join(dir, entry.name);
          const relPath = relative(targetDir, fullPath).replace(/\\/g, '/');

          if (search) {
            if (entry.name.toLowerCase().includes(search.toLowerCase())) {
              folderList.push(relPath);
            }
            await scan(fullPath);
          } else {
            folderList.push(entry.name);
          }
        }
      }
    };

    if (search) {
      await scan(targetDir);
    } else {
      const entries = await readdir(targetDir, { withFileTypes: true });
      const folders = entries
        .filter((e) => {
          if (!e.isDirectory()) return false;
          if (e.name === '.trash') return false;
          if (!showHidden && e.name.startsWith('.')) return false;
          return true;
        })
        .map((e) => e.name);
      return { success: true, data: folders };
    }

    return { success: true, data: folderList };
  } catch (error) {
    console.error('Get Folders Error:', error);
    return { success: false, data: [] };
  }
}

/**
 * Get all media with pagination and filters (Pure Filesystem)
 */
export async function getMedia(
  page: number = 1,
  limit: number = 20,
  search: string = '',
  folder: string = '',
  isTrashed: boolean = false,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
  showHidden: boolean = false,
  recursive: boolean = false
): Promise<MediaResponse> {
  try {
    const targetBase = isTrashed ? TRASH_ROOT : UPLOAD_ROOT;
    const targetDir = join(targetBase, folder);

    if (!existsSync(targetDir)) {
      return {
        success: true,
        data: [],
        meta: { total: 0, page: 1, limit, totalPages: 0 },
      };
    }

    let mediaList: Media[] = [];

    // Helper for recursive scan
    const scan = async (dir: string) => {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          // Only go deeper if we are searching OR recursive mode is on, and not in trash root
          if ((search || recursive) && entry.name !== '.trash') {
            await scan(fullPath);
          }
        } else if (entry.isFile()) {
          const fileStat = await stat(fullPath);
          const extension = extname(entry.name).toLowerCase();
          const q = search.toLowerCase();

          // Apply search filter during scan if searching
          if (search && !entry.name.toLowerCase().includes(q) && !extension.includes(q)) {
            continue;
          }

          // Apply hidden filter
          if (!showHidden && entry.name.startsWith('.')) {
            continue;
          }

          const relPath = relative(targetBase, fullPath).replace(/\\/g, '/');
          const urlPath = relative(UPLOAD_ROOT, fullPath).replace(/\\/g, '/');
          const itemFolder = relative(targetBase, dir).replace(/\\/g, '/');

          const birthtime = fileStat.birthtimeMs > 0 ? fileStat.birthtime : fileStat.mtime;

          mediaList.push({
            id: relPath,
            name: entry.name,
            url: `/uploads/${urlPath}`,
            path: fullPath,
            size: Number(fileStat.size),
            type: getMimeType(extension),
            extension,
            folder: itemFolder,
            isTrashed,
            deletedAt: isTrashed ? fileStat.mtime.toISOString() : null,
            createdAt: birthtime.toISOString(),
            updatedAt: fileStat.mtime.toISOString(),
          });
        }
      }
    };

    // If searching OR recursive mode, we do a recursive scan from the targetDir
    // If NOT searching, we only do a flat scan of the targetDir
    if (search || recursive) {
      await scan(targetDir);
    } else {
      const entries = await readdir(targetDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile()) {
          if (!showHidden && entry.name.startsWith('.')) continue;

          const fullPath = join(targetDir, entry.name);
          const fileStat = await stat(fullPath);
          const extension = extname(entry.name).toLowerCase();

          const relPath = relative(targetBase, fullPath).replace(/\\/g, '/');
          const urlPath = relative(UPLOAD_ROOT, fullPath).replace(/\\/g, '/');

          const birthtime = fileStat.birthtimeMs > 0 ? fileStat.birthtime : fileStat.mtime;

          mediaList.push({
            id: relPath,
            name: entry.name,
            url: `/uploads/${urlPath}`,
            path: fullPath,
            size: Number(fileStat.size),
            type: getMimeType(extension),
            extension,
            folder,
            isTrashed,
            deletedAt: isTrashed ? fileStat.mtime.toISOString() : null,
            createdAt: birthtime.toISOString(),
            updatedAt: fileStat.mtime.toISOString(),
          });
        }
      }
    }

    // Sorting
    mediaList.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Pagination
    const total = mediaList.length;
    const skip = (page - 1) * limit;
    const data = mediaList.slice(skip, skip + limit);

    return {
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Get Media Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, limit, totalPages: 0 },
      error: 'Gagal mengambil data media.',
    };
  }
}

/**
 * Helper to process and compress media based on type
 */
async function processMediaUpload(buffer: Buffer, finalPath: string, extension: string) {
  const ext = extension.toLowerCase();

  // 1. Image Compression (Always WebP)
  if (['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif'].includes(ext)) {
    const isAnimated = ext === '.gif';
    const pipeline = sharp(buffer, { animated: isAnimated });

    // Change extension to .webp
    const finalWebpPath = finalPath.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');

    await pipeline.webp({ quality: 82, effort: 4 }).toFile(finalWebpPath);
    return;
  }

  // 2. Video Compression (FFmpeg Native Spawn)
  if (['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext)) {
    const tempSource = `${finalPath}.tmp${Date.now()}`;
    await writeFile(tempSource, buffer);

    try {
      await new Promise((resolve, reject) => {
        const process = spawn('ffmpeg', [
          '-i',
          tempSource,
          '-vcodec',
          'libx264',
          '-crf',
          '26',
          '-preset',
          'fast',
          '-movflags',
          '+faststart',
          '-y',
          finalPath,
        ]);

        process.on('close', (code) => {
          if (code === 0) resolve(true);
          else reject(new Error(`FFmpeg gagal dengan kode: ${code}`));
        });

        process.on('error', (err) => {
          reject(err);
        });
      });
    } finally {
      if (existsSync(tempSource)) {
        await unlink(tempSource);
      }
    }
    return;
  }

  // 3. Others (PDF, Zip, etc.) - Write as is
  await writeFile(finalPath, buffer);
}

/**
 * Upload Multiple Media
 */
export async function uploadMedia(
  formData: FormData,
  folder: string = ''
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const files = formData.getAll('files') as File[];
    const paths = formData.getAll('paths') as string[];
    if (files.length === 0) return { success: false, error: 'Tidak ada file yang diunggah.' };

    const targetBase = join(UPLOAD_ROOT, folder);
    await ensureDir(targetBase);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relativePath = paths[i] || file.name;
      const buffer = Buffer.from(await file.arrayBuffer());

      // Calculate final target path
      const finalPath = join(targetBase, relativePath);
      const targetDir = dirname(finalPath);

      // Ensure subdirectories exist
      await ensureDir(targetDir);

      // Process and Compress
      await processMediaUpload(buffer, finalPath, extname(file.name));
    }

    return { success: true, message: `${files.length} file berhasil diunggah dengan optimasi.` };
  } catch (error) {
    console.error('Upload Media Error:', error);
    return { success: false, error: 'Gagal mengunggah media.' };
  }
}

/**
 * Move to Trash (Flat Filesystem move)
 */
export async function moveToTrash(
  ids: string[]
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    await ensureDir(TRASH_ROOT);

    // Collect URLs for database cleanup
    const deletedUrls = ids.map((id) => `/uploads/${id.replace(/\\/g, '/')}`);

    for (const id of ids) {
      const sourcePath = join(UPLOAD_ROOT, id);
      const filename = id.split(/[\\/]/).pop() || '';

      let targetPath = join(TRASH_ROOT, filename);

      // Handle collision in trash
      if (existsSync(targetPath)) {
        const ext = extname(filename);
        const base = filename.replace(ext, '');
        targetPath = join(TRASH_ROOT, `${Date.now()}-${base}${ext}`);
      }

      if (existsSync(sourcePath)) {
        await rename(sourcePath, targetPath);
      }
    }

    // Trigger background cleanup for broken references in DB
    const { cleanupMediaReferences } = await import('./cleanup');
    await cleanupMediaReferences(deletedUrls);

    return { success: true, message: 'Media dipindahkan ke sampah.' };
  } catch (error) {
    console.error('Move to Trash Error:', error);
    return { success: false, error: 'Gagal memindahkan ke sampah.' };
  }
}

/**
 * Restore from Trash (Restore to Root)
 */
export async function restoreMedia(
  ids: string[]
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    for (const id of ids) {
      const sourcePath = join(TRASH_ROOT, id);
      const filename = id.split(/[\\/]/).pop() || '';
      const targetPath = join(UPLOAD_ROOT, filename);

      if (existsSync(sourcePath)) {
        await rename(sourcePath, targetPath);
      }
    }

    return { success: true, message: 'Media berhasil dipulihkan ke Pustaka Utama.' };
  } catch (error) {
    console.error('Restore Media Error:', error);
    return { success: false, error: 'Gagal memulihkan media.' };
  }
}

/**
 * Delete Permanently
 */
export async function deleteMediaPermanently(
  ids: string[]
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Collect URLs for database cleanup
    const deletedUrls = ids.map((id) => `/uploads/${id.replace(/\\/g, '/')}`);

    for (const id of ids) {
      const filePath = join(TRASH_ROOT, id);
      if (existsSync(filePath)) {
        await rm(filePath, { recursive: true, force: true });
      } else {
        // Also check upload root just in case
        const uploadPath = join(UPLOAD_ROOT, id);
        if (existsSync(uploadPath)) {
          await rm(uploadPath, { recursive: true, force: true });
        }
      }
    }

    // Trigger background cleanup for broken references in DB
    const { cleanupMediaReferences } = await import('./cleanup');
    await cleanupMediaReferences(deletedUrls);

    return { success: true, message: 'Media berhasil dihapus secara permanen.' };
  } catch (error) {
    console.error('Delete Permanent Error:', error);
    return { success: false, error: 'Gagal menghapus media secara permanen.' };
  }
}

/**
 * Rename Media
 */
export async function renameMedia(id: string, newName: string): Promise<SingleMediaResponse> {
  try {
    const oldPath = join(UPLOAD_ROOT, id);
    if (!existsSync(oldPath)) return { success: false, error: 'File tidak ditemukan.' };

    const dir = join(oldPath, '..');
    const extension = extname(oldPath);
    const newFilename = newName.endsWith(extension) ? newName : `${newName}${extension}`;
    const newPath = join(dir, newFilename);

    await rename(oldPath, newPath);

    // Re-construct the media object to return
    const fileStat = await stat(newPath);
    const relPath = relative(UPLOAD_ROOT, newPath).replace(/\\/g, '/');
    const url = `/uploads/${relPath}`;

    const updated: Media = {
      id: relPath,
      name: newFilename,
      url,
      path: newPath,
      size: Number(fileStat.size),
      type: getMimeType(extension),
      extension,
      folder: relative(UPLOAD_ROOT, dir).replace(/\\/g, '/'),
      isTrashed: false,
      deletedAt: null,
      createdAt: fileStat.birthtime.toISOString(),
      updatedAt: fileStat.mtime.toISOString(),
    };

    return { success: true, data: updated, message: 'Media berhasil diubah namanya.' };
  } catch (error) {
    console.error('Rename Media Error:', error);
    return { success: false, error: 'Gagal mengubah nama media.' };
  }
}

/**
 * Move Media to Folder
 */
export async function moveMedia(
  ids: string[],
  targetFolder: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const targetDir = join(UPLOAD_ROOT, targetFolder);
    await ensureDir(targetDir);

    for (const id of ids) {
      const sourcePath = join(UPLOAD_ROOT, id);
      const filename = id.split('/').pop() || '';
      const targetPath = join(targetDir, filename);

      if (existsSync(sourcePath)) {
        await rename(sourcePath, targetPath);
      }
    }

    return {
      success: true,
      message: `Media berhasil dipindahkan ke folder ${targetFolder || 'Root'}.`,
    };
  } catch (error) {
    console.error('Move Media Error:', error);
    return { success: false, error: 'Gagal memindahkan media.' };
  }
}

/**
 * Sync (Now does nothing as we are FS-only, but kept for interface compatibility)
 */
export async function syncMediaLibrary(): Promise<{ success: boolean; message?: string }> {
  return { success: true, message: 'Filesystem selalu sinkron.' };
}

function getMimeType(ext: string): string {
  const mimes: Record<string, string> = {
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.zip': 'application/zip',
  };
  return mimes[ext.toLowerCase()] || 'application/octet-stream';
}
