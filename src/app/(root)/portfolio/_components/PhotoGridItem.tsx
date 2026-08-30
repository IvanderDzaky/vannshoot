import type { FC } from 'react';
import type { Photo } from '../_data';

interface Props {
  photo: Photo;
}

const PhotoGridItem: FC<Props> = ({ photo }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111419] shadow-[0_24px_80px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-2">
      <div className="aspect-3/4 overflow-hidden relative w-full">
        <img
          loading="lazy"
          src={photo.image}
          alt={photo.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f11] via-[#0b0f11]/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
        
        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#fe7f2d] transition-colors duration-300">
            {photo.title}
          </h3>
          {photo.details && (
            <p className="text-xs leading-relaxed text-[#c8c7c4] opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
              {photo.details}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoGridItem;
