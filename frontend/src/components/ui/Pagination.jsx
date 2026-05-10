import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-1.5 py-8" aria-label="Pagination">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/10"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2} />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-semibold transition-all duration-150 border
            ${page === currentPage
              ? 'ds-btn-primary text-white border-[#b3a0ff]/40 shadow-[0_0_18px_rgba(122,92,255,0.35)]'
              : 'text-white/70 hover:text-white bg-[#12182a] border-white/10 hover:bg-white/[0.06] hover:border-[#8f74ff]/35'
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/10"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" strokeWidth={2} />
      </button>
    </nav>
  );
}
