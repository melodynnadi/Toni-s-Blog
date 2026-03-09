import { db } from '@/lib/firebase';
import type { Post } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import CommentSection from '@/components/CommentSection';
import Link from 'next/link';
import { BLOG_NAME } from '@/lib/constants';
import { FiArrowLeft } from 'react-icons/fi';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const q = query(
      collection(db, 'posts'),
      where('slug', '==', slug),
      where('published', '==', true),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: doc.data().updated_at || '',
    } as Post;
  } catch {
    console.warn('Firebase not configured — cannot fetch post');
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      authors: [post.author],
      images: post.image ? [post.image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-pink-accent hover:text-pink-deep transition-colors mb-8"
      >
        <FiArrowLeft size={14} />
        Back to Home
      </Link>

      <article>
        {/* Hero Image */}
        {post.image && (
          <div className="aspect-[16/9] overflow-hidden mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
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
          <span className="text-text-light">|</span>
          <span className="text-[11px] text-text-light tracking-wide">
            {post.author.toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl font-bold text-text mb-8 leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {post.title}
        </h1>

        {/* Divider */}
        <hr className="section-divider mb-8" />

        {/* Content */}
        <div className="prose-blog">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <hr className="section-divider my-12" />

      <CommentSection postId={post.id} />
    </div>
  );
}
