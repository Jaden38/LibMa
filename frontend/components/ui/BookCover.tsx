import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface BookCoverProps {
  imageUrl: string | null;
  title: string;
  className?: string;
}

const BookCover: React.FC<BookCoverProps> = ({ imageUrl, title, className }) => {
  const [imgSrc, setImgSrc] = useState<string>("/images/placeholder.png");

  useEffect(() => {
    if (imageUrl) {
      setImgSrc(imageUrl);
    }
  }, [imageUrl]);

  return (
    <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-lg ${className}`}>
      <Image
        src={imgSrc}
        alt={`Couverture de ${title}`}
        fill
        className="object-cover"
        priority
        onError={() => setImgSrc("/images/placeholder-book-cover.png")}
      />
    </div>
  );
};

export default BookCover;