'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { BLOG_NAME, CATEGORIES } from '@/lib/constants';

const topLinks = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm">
      {/* Top utility bar */}
      <div className="gradient-pink-soft">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-10">
          <nav className="hidden md:flex items-center gap-6">
            {topLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] tracking-[0.15em] text-pink-deep/70 hover:text-pink-deep transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-pink-deep/70 hover:text-pink-deep transition-colors p-1"
              aria-label="Search"
            >
              <FiSearch size={14} />
            </button>
            {showSearch && (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="text-xs border border-pink-soft px-3 py-1 w-40 focus:outline-none focus:border-pink-accent bg-white/80"
                  autoFocus
                />
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="py-8 text-center">
        <Link href="/">
          <h1
            className="text-5xl sm:text-6xl font-normal italic gradient-pink-text"
            style={{ fontFamily: 'var(--font-logo)' }}
          >
            {BLOG_NAME}
          </h1>
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="border-t border-b border-border">
        <div className="max-w-5xl mx-auto px-4">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center justify-center gap-8 h-12">
            <Link href="/" className="text-[11px] tracking-[0.2em] text-text hover:text-pink-accent transition-colors font-medium">
              HOME
            </Link>
            <Link href="/categories" className="text-[11px] tracking-[0.2em] text-text hover:text-pink-accent transition-colors font-medium">
              BLOG
            </Link>
            {CATEGORIES.slice(0, 4).map((cat) => (
              <Link
                key={cat}
                href={`/categories/${cat.toLowerCase()}`}
                className="text-[11px] tracking-[0.2em] text-text hover:text-pink-accent transition-colors font-medium"
              >
                {cat.toUpperCase()}
              </Link>
            ))}
            <Link href="/about" className="text-[11px] tracking-[0.2em] text-text hover:text-pink-accent transition-colors font-medium">
              ABOUT
            </Link>
          </div>

          {/* Mobile nav toggle */}
          <div className="md:hidden flex items-center justify-between h-12">
            <span className="text-[11px] tracking-[0.2em] text-text font-medium">MENU</span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden pb-4 border-t border-border">
              <div className="flex flex-col items-center gap-3 pt-3">
                <Link href="/" onClick={() => setIsOpen(false)} className="text-[11px] tracking-[0.2em] text-text py-1">HOME</Link>
                <Link href="/categories" onClick={() => setIsOpen(false)} className="text-[11px] tracking-[0.2em] text-text py-1">BLOG</Link>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/categories/${cat.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] tracking-[0.2em] text-text py-1"
                  >
                    {cat.toUpperCase()}
                  </Link>
                ))}
                <Link href="/about" onClick={() => setIsOpen(false)} className="text-[11px] tracking-[0.2em] text-text py-1">ABOUT</Link>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="text-[11px] tracking-[0.2em] text-text py-1">CONTACT</Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
