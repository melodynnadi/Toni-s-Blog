'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 mt-10 pt-8 border-t border-border">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-3 py-2 text-xs tracking-[0.1em] uppercase text-text-light hover:text-pink-accent transition-colors"
        >
          ← Prev
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={`w-9 h-9 flex items-center justify-center text-sm transition-all rounded-full ${
            page === currentPage
              ? 'gradient-pink-btn font-semibold'
              : 'text-text-light hover:text-pink-accent hover:bg-pink-glow'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-3 py-2 text-xs tracking-[0.1em] uppercase text-text-light hover:text-pink-accent transition-colors"
        >
          Next →
        </Link>
      )}
    </div>
  );
}
