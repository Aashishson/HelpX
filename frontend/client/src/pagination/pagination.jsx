import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Don't render if there's only one page
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 py-8">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-1 px-3 py-2 bg-white border rounded-lg shadow-sm 
                   disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
      >
        <FiChevronLeft /> Previous
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          Page <span className="text-blue-600">{currentPage}</span> of{" "}
          {totalPages}
        </span>
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-1 px-3 py-2 bg-white border rounded-lg shadow-sm 
                   disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
      >
        Next <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
