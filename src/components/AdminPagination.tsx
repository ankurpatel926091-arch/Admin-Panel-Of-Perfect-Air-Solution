import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalItems === 0) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 px-1 select-none">
      {/* Summary Info */}
      <div className="text-xs text-slate-500 font-medium">
        Showing <span className="font-bold text-slate-800">{startIdx}</span> to{' '}
        <span className="font-bold text-slate-800">{endIdx}</span> of{' '}
        <span className="font-bold text-slate-800">{totalItems}</span> entries
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((p, idx) =>
          typeof p === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(p)}
              className={`min-w-[34px] h-[34px] px-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                currentPage === p
                  ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-sky-500/20'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={idx} className="px-1.5 text-xs text-slate-400 font-bold">
              ...
            </span>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
