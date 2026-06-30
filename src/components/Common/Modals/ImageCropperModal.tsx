'use client';
import { useState, useRef, useEffect, type FC } from 'react';
import dynamic from 'next/dynamic';
import { type CropperRef } from 'react-advanced-cropper';
import { Scissors, Check, X, Loader2 } from 'lucide-react';
import 'react-advanced-cropper/dist/style.css';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Modal from './Modal';

// Load Cropper dynamically with SSR disabled to prevent Canvas/document errors in Next.js
const Cropper = dynamic(() => import('react-advanced-cropper').then((mod) => mod.Cropper), {
  ssr: false,
});

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onCrop: (croppedFile: File) => void;
  aspectRatio?: number;
  outputWidth?: number;
  outputHeight?: number;
  customFileName?: string;
}

const ImageCropperModal: FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCrop,
  aspectRatio,
  outputWidth,
  outputHeight,
  customFileName = 'cropped-image',
}) => {
  const cropperRef = useRef<CropperRef>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAspectRatio, setCurrentAspectRatio] = useState<number | undefined>(aspectRatio);

  // Set mounted flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync aspect ratio when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentAspectRatio(aspectRatio);
    }
  }, [isOpen, aspectRatio]);

  // Refresh cropper geometry once the modal is fully opened to ensure parent bounds are loaded
  useEffect(() => {
    if (isOpen && mounted) {
      const timer = setTimeout(() => {
        cropperRef.current?.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mounted]);

  const handleCrop = () => {
    if (cropperRef.current) {
      setIsLoading(true);
      const canvas = cropperRef.current.getCanvas(
        outputWidth && outputHeight
          ? {
              width: outputWidth,
              height: outputHeight,
            }
          : undefined
      );
      if (canvas) {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const fileName = customFileName.endsWith('.webp')
                ? customFileName
                : `${customFileName}.webp`;
              const file = new File([blob], fileName, { type: 'image/webp' });
              onCrop(file);
              onClose();
            }
            setIsLoading(false);
          },
          'image/webp',
          0.95
        );
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!imageSrc) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Potong Gambar"
      description="Sesuaikan area gambar yang ingin ditampilkan agar terlihat sempurna."
      className="sm:max-w-5xl w-full"
    >
      <div className="mt-2 flex flex-col gap-6 w-full">
        {/* Stable container height ensures cropper has nonzero dimensions to calculate stencil placement */}
        <div className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] overflow-hidden rounded-xl bg-[#0a0a0a] border border-white/5 shadow-2xl">
          {mounted && isOpen && (
            <Cropper
              key={currentAspectRatio || 'free'}
              ref={cropperRef}
              src={imageSrc}
              stencilProps={{
                aspectRatio: currentAspectRatio,
                grid: true,
              }}
              defaultSize={({ imageSize }) => {
                if (currentAspectRatio) {
                  const imageRatio = imageSize.width / imageSize.height;
                  if (imageRatio > currentAspectRatio) {
                    return {
                      width: imageSize.height * currentAspectRatio,
                      height: imageSize.height,
                    };
                  } else {
                    return {
                      width: imageSize.width,
                      height: imageSize.width / currentAspectRatio,
                    };
                  }
                }
                return {
                  width: imageSize.width,
                  height: imageSize.height,
                };
              }}
              className="h-full w-full"
            />
          )}
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <span className="text-xs font-semibold text-muted-foreground mr-2">Pilih Rasio:</span>
          {[
            { label: 'Bebas', value: undefined },
            { label: '1:1 (Square)', value: 1 },
            { label: '16:9 (Landscape)', value: 16 / 9 },
            { label: '4:3 (Standard)', value: 4 / 3 },
            { label: '3:2 (Photo)', value: 3 / 2 },
            { label: '2:3 (Portrait)', value: 2 / 3 },
            { label: '3:4 (Portrait)', value: 3 / 4 },
            { label: '9:16 (Portrait)', value: 9 / 16 },
          ].map((option) => {
            const isSame =
              (currentAspectRatio === undefined && option.value === undefined) ||
              (currentAspectRatio !== undefined &&
                option.value !== undefined &&
                Math.abs(currentAspectRatio - option.value) < 0.01);
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => setCurrentAspectRatio(option.value)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-xl transition-all border cursor-pointer',
                  isSame
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-muted-foreground border-zinc-200 dark:border-zinc-800'
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/40 p-4 rounded-2xl border border-border/50 backdrop-blur-md w-full">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="h-12 w-12 flex items-center justify-center bg-primary/10 rounded-2xl text-primary shrink-0 shadow-inner">
              <Scissors className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold leading-none">Gunakan Area Terpilih</p>
              <p className="text-xs text-muted-foreground">
                Geser atau zoom untuk menyesuaikan bingkai.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:w-auto shrink-0">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              <X />
              Batal
            </Button>
            <Button onClick={handleCrop} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Check />
                  Potong & Simpan
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropperModal;
