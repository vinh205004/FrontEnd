import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  className = ""
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  
  // Calculate start and end page numbers
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Previous button
  pages.push(
    <button
      key="prev"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-3 py-2 border rounded ${
        currentPage === 1
          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
      aria-label="Trang trước"
    >
      <ChevronLeft size={16} />
    </button>
  );

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`px-3 py-2 border rounded ${
          i === currentPage
            ? 'bg-gray-800 text-white border-gray-800'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-label={`Trang ${i}`}
      >
        {i}
      </button>
    );
  }

  // Next button
  pages.push(
    <button
      key="next"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`px-3 py-2 border rounded ${
        currentPage === totalPages
          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
      aria-label="Trang sau"
    >
      <ChevronRight size={16} />
    </button>
  );

  return (
    <div className={`flex items-center justify-center gap-2 mt-8 ${className}`}>
      {pages}
    </div>
  );
};

export default Pagination;
