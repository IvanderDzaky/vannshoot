'use client';
import type { FC } from 'react';
import { Upload } from 'lucide-react';

type DragOverlayProps = {
  isDragging: boolean;
  isReplacing: boolean;
};

const DragOverlay: FC<DragOverlayProps> = ({ isDragging, isReplacing }) => {
  if (!isDragging) return null;

  return (
    <div className="absolute inset-0 z-50 bg-primary/5 backdrop-blur-[2px] rounded-3xl border-4 border-dashed border-primary/50 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8 bg-background/80 backdrop-blur-md rounded-full shadow-2xl border border-primary/20 animate-bounce">
        <Upload className="h-12 w-12 text-primary" />
      </div>
      <div className="text-center px-6 py-3 bg-background/80 backdrop-blur-md rounded-2xl shadow-xl border border-primary/20">
        <p className="text-xl font-bold text-primary">
          {isReplacing ? 'Lepas untuk Ganti Cover' : 'Lepas untuk Unggah Cover'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          WebP, PNG, JPG (Maks. 5MB, Min. 600x400px)
        </p>
      </div>
    </div>
  );
};

export default DragOverlay;
