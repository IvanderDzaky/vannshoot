'use client';
import { type FC, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from './Modal';
import { Button } from '@/components/ui/button';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string | null | undefined;
  images?: string[];
  title?: string;
  aspectRatio?: 'video' | '3/2' | '1/1' | '16/9';
}

const ImagePreviewModal: FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  images = [],
  title,
  aspectRatio = '3/2',
}) => {
  const allImages = [...(imageSrc ? [imageSrc] : []), ...images.filter((img) => img !== imageSrc)];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  if (allImages.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === '3/2'
        ? 'aspect-[3/2]'
        : 'aspect-square';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Pratinjau Gambar'}
      description={
        allImages.length > 1
          ? `Gambar ke-${currentIndex + 1} dari ${allImages.length}`
          : 'Tampilan penuh gambar yang dipilih.'
      }
      className={aspectRatio === '1/1' ? 'sm:max-w-md' : 'sm:max-w-3xl'}
    >
      <div
        className={`relative mt-2 w-full ${aspectClass} rounded-2xl overflow-hidden bg-black/5 border border-white/5 shadow-2xl group/modal`}
      >
        <Image
          key={allImages[currentIndex]}
          src={allImages[currentIndex]}
          alt={title || 'Preview'}
          fill
          className="object-cover w-full h-full animate-in fade-in zoom-in-95 duration-500"
          priority
        />

        {/* Cover Label */}
        {imageSrc && currentIndex === 0 && (
          <div className="absolute top-4 left-4 z-20">
            <div className="px-3 py-1.5 rounded-xl bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-bold tracking-widest uppercase shadow-xl animate-in slide-in-from-top-2 duration-500">
              Cover
            </div>
          </div>
        )}

        {allImages.length > 1 && (
          <>
            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover/modal:opacity-100 transition-opacity duration-300">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-black/20 backdrop-blur-md border-white/10 hover:bg-black/40 h-10 w-10 text-white"
                onClick={handlePrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover/modal:opacity-100 transition-opacity duration-300">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-black/20 backdrop-blur-md border-white/10 hover:bg-black/40 h-10 w-10 text-white"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 opacity-0 group-hover/modal:opacity-100 transition-opacity duration-300">
              {allImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-6 bg-white shadow-lg' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose} className="rounded-xl px-8">
          Tutup
        </Button>
      </div>
    </Modal>
  );
};

export default ImagePreviewModal;
