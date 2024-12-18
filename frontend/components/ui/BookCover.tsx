import React, { useEffect, useState } from 'react';

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
    <div className={`aspect-[3/4] w-full overflow-hidden rounded-lg ${className}`}>
    </div>
  );
};

export default BookCover;