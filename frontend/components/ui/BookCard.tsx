import React from "react";

interface BookCardProps {
  title: string;
  author: string;
}

const BookCard: React.FC<BookCardProps> = ({ title, author }) => {
  return (
    <div className="p-4 border rounded shadow-md hover:shadow-lg transition-all">
      <h3 className="font-medium">{title}</h3>
      <p className="text-gray-500">{author}</p>
    </div>
  );
};

export default BookCard;