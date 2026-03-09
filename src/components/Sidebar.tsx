import Link from 'next/link';
import { AUTHOR_NAME, CATEGORIES } from '@/lib/constants';
import type { Post } from '@/lib/firebase';
import { BlogCardCompact } from './BlogCard';
import { FiInstagram, FiTwitter } from 'react-icons/fi';

interface SidebarProps {
  recentPosts?: Post[];
}

export default function Sidebar({ recentPosts = [] }: SidebarProps) {
  return (
    <aside className="space-y-10">
      {/* About Me Widget */}
      <div className="bg-pink-light rounded-xl p-5">
        <h3 className="widget-title">About Me</h3>
        <div className="text-center">
          <div className="w-36 h-36 mx-auto mb-4 bg-white/60 overflow-hidden rounded-full border-2 border-pink-primary">
            <img
              src="/images/toni-about.png"
              alt={AUTHOR_NAME}
              className="w-full h-full object-cover"
            />
          </div>
          <p
            className="text-sm text-text-light leading-relaxed"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Hi, I&apos;m {AUTHOR_NAME}! Welcome to my blog where I share thoughts on life, school, fitness, and everything in between. Thanks for stopping by.
          </p>
        </div>
      </div>

      {/* Follow Us Widget */}
      <div>
        <h3 className="widget-title">Follow Along</h3>
        <div className="space-y-2">
          {[
            { icon: FiInstagram, label: 'Instagram', handle: '@tonisblog', href: '#' },
            { icon: FiTwitter, label: 'Twitter', handle: '@tonisblog', href: '#' },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="flex items-center justify-between px-4 py-2.5 border border-pink-soft hover:border-pink-primary transition-colors group rounded-lg hover:bg-pink-glow/50"
            >
              <div className="flex items-center gap-3">
                <social.icon size={14} className="text-text-light" />
                <span className="text-[11px] tracking-[0.1em] uppercase text-text font-medium">{social.label}</span>
              </div>
              <span className="text-[10px] tracking-[0.1em] uppercase text-text-light group-hover:text-text transition-colors">Follow</span>
            </a>
          ))}
        </div>
      </div>

      {/* Categories Widget */}
      <div>
        <h3 className="widget-title">Categories</h3>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/categories/${cat.toLowerCase()}`}
              className="block text-sm text-text-light hover:text-pink-accent transition-colors py-1 border-b border-pink-light/50 last:border-0"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Posts Widget */}
      {recentPosts.length > 0 && (
        <div>
          <h3 className="widget-title">Recent Posts</h3>
          <div className="space-y-4">
            {recentPosts.slice(0, 4).map((post) => (
              <BlogCardCompact key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
