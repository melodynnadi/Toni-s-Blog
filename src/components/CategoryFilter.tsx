'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants';

interface CategoryFilterProps {
  activeCategory?: string;
  basePath?: string;
}

export default function CategoryFilter({ activeCategory, basePath = '/categories' }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Link
        href={basePath === '/categories' ? '/categories' : '/'}
        className={`text-[11px] tracking-[0.12em] uppercase transition-colors pb-1 ${
          !activeCategory
            ? 'text-pink-accent font-semibold border-b-2 border-pink-accent'
            : 'text-text-light hover:text-pink-accent'
        }`}
      >
        All
      </Link>
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <Link
            key={category}
            href={`${basePath}/${category.toLowerCase()}`}
            className={`text-[11px] tracking-[0.12em] uppercase transition-colors pb-1 ${
              isActive
                ? 'text-pink-accent font-semibold border-b-2 border-pink-accent'
                : 'text-text-light hover:text-pink-accent'
            }`}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}
