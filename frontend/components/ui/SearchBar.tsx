// components/ui/SearchBar.tsx
import React from "react";
import Input from "./Input";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <Input
        type="text"
        placeholder="Search books"
        value={value}
        onChange={onChange}
        className="w-full max-w-md"
      />
    </div>
  );
};

export default SearchBar;