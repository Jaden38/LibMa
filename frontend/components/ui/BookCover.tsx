import React, { useEffect, useState } from 'react';

interface BookCoverProps {
  cover: string | null;  // Changed from cover_image to match the usage
  title: string;
  className?: string;
}

const BookCover: React.FC<BookCoverProps> = ({ cover, title, className }) => {
  const [imgSrc, setImgSrc] = useState<string>("/images/placeholder.png");

  useEffect(() => {
    if (cover) {
      try {
        // Check if the cover already includes the data URI prefix
        if (cover.startsWith('data:')) {
          setImgSrc(cover);
        } else {
          // If it's just the base64 data, detect type and add prefix
          const imageType = cover.startsWith('/9j/') ? 'jpeg' : 'png';
          setImgSrc(`data:image/${imageType};base64,${cover}`);
        }
      } catch (error) {
        console.error('Error setting image:', error);
        setImgSrc("/images/placeholder.png");
      }
    }
  }, [cover]);

  return (
    <div className={`aspect-[3/4] w-full overflow-hidden rounded-lg ${className}`}>
      <img 
        src={imgSrc}
        alt={`Couverture de ${title}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          console.error('Image loading error for:', title);
          console.error('Current src:', target.src.slice(0, 100) + '...');
          setImgSrc("/images/placeholder.png");
        }}
      />
    </div>
  );
};

export default BookCover;