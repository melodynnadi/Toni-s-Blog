import Link from 'next/link';
import { format } from 'date-fns';
import type { Post } from '@/lib/firebase';

export default function BlogCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col sm:flex-row gap-6 pb-8 mb-8 border-b border-border last:border-b-0 last:mb-0 last:pb-0 hover:bg-pink-glow/50 transition-colors p-3 -m-3 rounded-xl">
      {/* Thumbnail */}
      <Link href={`/blog/${post.slug}`} className="block shrink-0 sm:w-64">
        <div className="aspect-[4/3] bg-pink-light overflow-hidden rounded-lg">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-pink-bg">
              <span className="text-3xl opacity-30" style={{ fontFamily: 'var(--font-heading)' }}>
                &#10047;
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col justify-center">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-2">
          <Link
            href={`/categories/${post.category.toLowerCase()}`}
            className="text-[11px] tracking-[0.1em] uppercase text-pink-accent hover:text-text transition-colors font-medium"
          >
            {post.category}
          </Link>
          <span className="text-text-light">|</span>
          <span className="text-[11px] text-text-light tracking-wide">
            {format(new Date(post.created_at), 'MMMM d, yyyy').toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h2
            className="text-xl font-semibold text-text group-hover:text-pink-accent transition-colors mb-3 leading-snug"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p
          className="text-sm text-text-light leading-relaxed mb-4 line-clamp-3"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {post.excerpt}
        </p>

        {/* Share count placeholder */}
        <div className="flex items-center gap-1 text-text-light">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="text-[11px] tracking-wide">Shares</span>
        </div>
      </div>
    </article>
  );
}

/* Compact card variant for sidebar widget */
export function BlogCardCompact({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex gap-3">
      <div className="shrink-0 w-16 h-16 bg-pink-light overflow-hidden rounded-lg">
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-pink-bg flex items-center justify-center">
            <span className="text-sm opacity-30">&#10047;</span>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <h4 className="text-xs font-semibold text-text group-hover:text-pink-accent transition-colors line-clamp-2 leading-snug mb-1">
          {post.title}
        </h4>
        <span className="text-[10px] text-text-light uppercase tracking-wide">
          {format(new Date(post.created_at), 'MMM d, yyyy')}
        </span>
      </div>
    </Link>
  );
}
