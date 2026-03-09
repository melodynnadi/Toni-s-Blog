import Link from 'next/link';
import { BLOG_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="mt-16">
      <div className="gradient-pink-soft py-1"></div>
      <div className="bg-white/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="text-center">
            <Link href="/">
              <h3
                className="text-2xl italic gradient-pink-text mb-4"
                style={{ fontFamily: 'var(--font-logo)' }}
              >
                {BLOG_NAME}
              </h3>
            </Link>
            <nav className="flex items-center justify-center gap-6 mb-6">
              {[
                { href: '/', label: 'Home' },
                { href: '/categories', label: 'Blog' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] tracking-[0.12em] text-text-light hover:text-pink-accent transition-colors uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="text-xs text-text-light">
              &copy; {new Date().getFullYear()} {BLOG_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
