'use client';
import { useState, type FC, useRef, type ChangeEvent, useEffect } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

import { Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
// import MediaPickerModal from '@/components/Common/MediaPicker/MediaPicker';
import ImageCropperModal from '@/components/Common/Modals/ImageCropperModal';

type ImageUploadProps = {
  value: string;
  initialValue?: string;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onSelect: (url: string) => void;
  onRemove: () => void;
  customFileName?: string;
  disabled?: boolean;
  disabledMessage?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUpload: FC<ImageUploadProps> = ({
  value,
  isUploading,
  onUpload,
  onSelect,
  onRemove,
  customFileName,
  disabled,
  disabledMessage,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [tempFileName, setTempFileName] = useState<string>('cropped-image');

  // Sync preview with value prop
  useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar.');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error('Ukuran file maksimal 5MB.');
        return;
      }

      // Validasi Dimensi & Rasio
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const ratio = width / height;

        URL.revokeObjectURL(img.src);

        if (width < 400 || height < 400) {
          toast.error(`Ukuran gambar terlalu kecil (${width}x${height}px). Minimal 400x400px.`);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        // Jika lolos validasi, lanjut ke cropper
        const originalName = file.name.split('.')[0].replace(/\s+/g, '-').toLowerCase();
        setTempFileName(`${originalName}-cropped`);

        const reader = new FileReader();
        reader.onload = () => {
          setCropperImageSrc(reader.result as string);
          setIsCropperOpen(true);
        };
        reader.readAsDataURL(file);
      };
    }
  };

  const handleCroppedImage = (croppedFile: File) => {
    onUpload(croppedFile);
  };

  const handleMediaSelect = async (url: string) => {
    onSelect(url);
    setPreviewUrl(url);
    toast.success('Gambar dipilih dari pustaka.');
  };

  const removeImage = async () => {
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onRemove();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Field>
      <FieldLabel>Cover / Gambar Thumbnail</FieldLabel>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
        disabled={isUploading}
      />

      <div className="mt-2">
        {previewUrl ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed group">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain bg-muted/50"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
              <Button
                type="button"
                size="sm"
                className="bg-white hover:bg-zinc-200 text-zinc-950 border-none font-bold shadow-xl"
                onClick={() => {
                  if (disabled && disabledMessage) {
                    toast.error(disabledMessage);
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                disabled={isUploading}
              >
                Ganti
              </Button>
              {/* <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsPickerOpen(true)}
                disabled={isUploading}
              >
                Pustaka
              </Button> */}
              <Button
                type="button"
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white border-none font-bold shadow-xl"
                onClick={removeImage}
                disabled={isUploading}
              >
                Hapus
              </Button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col gap-2 text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs">Mengompres...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* INFO: change to md:grid-cols-2 if you want to add button library */}
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
              className={`w-full aspect-video flex flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/25 rounded-xl hover:bg-muted/50 hover:border-primary/50 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">
                {isUploading ? 'Memproses...' : 'Upload Gambar Baru'}
              </span>
            </button>
            {/* <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              disabled={isUploading}
              className="w-full aspect-video flex flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/25 rounded-xl hover:bg-muted/50 hover:border-primary/50 transition-all"
            >
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Pilih dari Pustaka</span>
            </button> */}
          </div>
        )}
      </div>

      {/* <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleMediaSelect}
      /> */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={cropperImageSrc}
        onCrop={handleCroppedImage}
        aspectRatio={3 / 2}
        customFileName={customFileName || tempFileName}
      />
      <p className="text-xs text-muted-foreground mt-2">
        Maksimal 5MB. Minimal 400x400px (Mendukung Landscape & Portrait). Gambar akan dikompres
        secara otomatis menjadi WebP untuk menghemat penyimpanan.
      </p>
    </Field>
  );
};

export default ImageUpload;
