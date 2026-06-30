'use client';
import { useState, type FC, useRef, type ChangeEvent, useEffect, useCallback } from 'react';
import { Loader2, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

import { deleteImage } from '@/services/uploads';
import { Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

type MultiImageUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  isUploading: boolean;
  setIsUploading: (loading: boolean) => void;
  onNewUpload?: (url: string) => void;
  folder?: string;
  disabled?: boolean;
  disabledMessage?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Upload file via API Route (bukan Server Action).
 * Menggunakan fetch + FormData agar setiap request fresh,
 * menghindari masalah stream/buffer yang tersisa dari request sebelumnya.
 */
async function uploadViaApi(
  file: File,
  folder: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('subDir', folder);

  console.log(
    `[uploadViaApi] 📤 Mengirim fetch ke /api/upload | file: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`
  );

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => 'No body');
    console.error(`[uploadViaApi] ❌ HTTP ${response.status}: ${text}`);
    throw new Error(`Server error ${response.status}`);
  }

  const result = await response.json();
  console.log(`[uploadViaApi] 📥 Response:`, result);
  return result;
}

const MultiImageUpload: FC<MultiImageUploadProps> = ({
  value = [],
  onChange,
  isUploading: isUploadingExternal,
  setIsUploading,
  onNewUpload,
  folder = 'portfolios',
  disabled,
  disabledMessage,
}) => {
  const [previews, setPreviews] = useState<string[]>(value);
  /** State uploading lokal — mencegah race condition dengan state shared dari parent */
  const [isLocalUploading, setIsLocalUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** Ref untuk melacak apakah komponen masih mounted agar tidak set state setelah unmount */
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setPreviews(value);
  }, [value]);

  /** Gabungkan state uploading: lokal ATAU dari parent */
  const isUploading = isLocalUploading || isUploadingExternal;

  const setUploadingState = useCallback(
    (loading: boolean) => {
      if (!isMountedRef.current) return;
      setIsLocalUploading(loading);
      setIsUploading(loading);
    },
    [setIsUploading]
  );

  const processFiles = async (files: FileList) => {
    if (isUploading) {
      console.warn('[MultiImageUpload] Upload sedang berjalan, permintaan baru diabaikan.');
      toast.warning('Sedang dalam proses upload, harap tunggu.');
      return;
    }

    const fileArray = Array.from(files);
    console.log(`[MultiImageUpload] ▶ Memproses ${fileArray.length} file dipilih`);

    // Filter valid images
    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith('image/')) {
        console.warn(`[MultiImageUpload] ⚠️ Bukan gambar: ${file.name} (type: ${file.type})`);
        toast.error(`${file.name} bukan gambar.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        console.warn(
          `[MultiImageUpload] ⚠️ File terlalu besar: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
        );
        toast.error(`${file.name} terlalu besar (Maks. 5MB).`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      console.log('[MultiImageUpload] Tidak ada file valid untuk diupload.');
      return;
    }

    console.log(
      `[MultiImageUpload] ✅ File valid: ${validFiles.length} dari ${fileArray.length} | Folder target: "${folder}"`
    );
    validFiles.forEach((f, i) => {
      console.log(`  [${i + 1}] ${f.name} — ${(f.size / 1024).toFixed(1)} KB — ${f.type}`);
    });

    setUploadingState(true);
    console.log('[MultiImageUpload] 🔄 State isUploading → true');

    try {
      // Upload semua file secara paralel dengan timeout per-file
      console.log(
        `[MultiImageUpload] 🚀 Memulai Promise.allSettled untuk ${validFiles.length} file...`
      );
      const results = await Promise.allSettled(
        validFiles.map((file) => uploadViaApi(file, folder))
      );

      if (!isMountedRef.current) {
        console.warn('[MultiImageUpload] Komponen sudah unmount, skip update state.');
        return;
      }

      const successUrls: string[] = [];

      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          const res = result.value;
          if (res.success && res.url) {
            console.log(
              `[MultiImageUpload] ✅ [${i + 1}/${results.length}] Berhasil: ${validFiles[i].name} → ${res.url}`
            );
            successUrls.push(res.url);
            onNewUpload?.(res.url);
          } else {
            console.error(
              `[MultiImageUpload] ❌ [${i + 1}/${results.length}] Server error untuk ${validFiles[i].name}:`,
              res.error
            );
            toast.error(
              `Gagal mengunggah ${validFiles[i].name}: ${res.error ?? 'Error tidak diketahui'}`
            );
          }
        } else {
          // rejected — bisa timeout atau error jaringan
          const errMsg =
            result.reason instanceof Error ? result.reason.message : 'Error tidak diketahui';
          console.error(
            `[MultiImageUpload] ❌ [${i + 1}/${results.length}] Upload ditolak untuk ${validFiles[i].name}:`,
            result.reason
          );
          toast.error(`Gagal mengunggah ${validFiles[i].name}: ${errMsg}`);
        }
      });

      if (successUrls.length > 0) {
        // Gunakan callback form untuk membaca nilai terkini (bukan stale closure)
        onChange([...value, ...successUrls]);
        console.log(
          `[MultiImageUpload] 📸 Total gambar berhasil: ${successUrls.length} | URLs:`,
          successUrls
        );
        toast.success(`${successUrls.length} gambar berhasil diunggah.`);
      } else {
        console.warn('[MultiImageUpload] Tidak ada gambar yang berhasil diupload.');
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      const errMsg = error instanceof Error ? error.message : 'Error tidak diketahui';
      console.error('[MultiImageUpload] 💥 Uncaught error di processFiles:', error);
      toast.error(`Terjadi kesalahan saat mengunggah: ${errMsg}`);
    } finally {
      if (isMountedRef.current) {
        setUploadingState(false);
        console.log('[MultiImageUpload] 🔄 State isUploading → false (finally)');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        console.warn(
          '[MultiImageUpload] Komponen sudah unmount di finally block, state tidak di-reset.'
        );
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
  };

  const removeImage = async (urlToRemove: string) => {
    if (isUploading) {
      toast.warning('Harap tunggu hingga upload selesai sebelum menghapus gambar.');
      return;
    }
    console.log(`[MultiImageUpload] 🗑️ Menghapus gambar: ${urlToRemove}`);
    try {
      // Jika URL adalah internal upload, hapus dari server
      if (urlToRemove.includes('/portfolios/')) {
        await deleteImage(urlToRemove);
        console.log(`[MultiImageUpload] ✅ File server dihapus: ${urlToRemove}`);
      } else {
        console.log(
          `[MultiImageUpload] ℹ️ URL eksternal, tidak menghapus dari server: ${urlToRemove}`
        );
      }
      const newUrls = value.filter((url) => url !== urlToRemove);
      onChange(newUrls);
      toast.success('Gambar dihapus.');
    } catch (error) {
      console.error(`[MultiImageUpload] ❌ Gagal menghapus gambar:`, error);
      toast.error('Gagal menghapus gambar dari server.');
    }
  };

  return (
    <Field>
      <FieldLabel>Galeri Gambar (Multiple)</FieldLabel>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
        {previews.map((url, index) => (
          <div
            key={url + index}
            className="relative aspect-square rounded-xl overflow-hidden border group"
          >
            <Image
              src={url}
              alt={`Gallery ${index}`}
              fill
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <Button
                type="button"
                size="icon"
                className="h-9 w-9 rounded-full bg-red-500 hover:bg-red-600 text-white border-none shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300"
                onClick={() => removeImage(url)}
                disabled={isUploading}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}

        {/* Tombol tambah gambar */}
        <button
          type="button"
          onClick={() => {
            if (disabled && disabledMessage) {
              toast.error(disabledMessage);
              return;
            }
            fileInputRef.current?.click();
          }}
          disabled={isUploading}
          className={`aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/25 rounded-xl hover:bg-muted/50 hover:border-primary/50 transition-all text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLocalUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
          <span className="text-[10px] font-medium">
            {isLocalUploading ? 'Mengunggah...' : 'Tambah Gambar'}
          </span>
        </button>
      </div>

      {/* Indikator error jika upload macet */}
      {isLocalUploading && (
        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Sedang mengunggah dan mengompresi gambar... Harap tunggu.
        </p>
      )}

      <p className="text-xs text-muted-foreground mt-2">
        Mendukung pemilihan banyak file sekaligus. Maks. 5MB per file.
      </p>
    </Field>
  );
};

export default MultiImageUpload;
