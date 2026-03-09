import { db } from '@/lib/firebase';
import type { Post } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, limit, startAfter, getCountFromServer } from 'firebase/firestore';
import { CATEGORIES, POSTS_PER_PAGE } from '@/lib/constants';
import BlogCard from '@/components/BlogCard';
import CategoryFilter from '@/components/CategoryFilter';
import Pagination from '@/components/Pagination';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse blog posts by category',
};

interface CategoriesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  let posts: Post[] = [];
  let totalCount = 0;

  try {
    const countQuery = query(collection(db, 'posts'), where('published', '==', true));
    const countSnap = await getCountFromServer(countQuery);
    totalCount = countSnap.data().count;

    let q = query(
      collection(db, 'posts'),
      where('published', '==', true),
      orderBy('created_at', 'desc'),
      limit(POSTS_PER_PAGE)
    );

    if (currentPage > 1) {
      const skipQuery = query(
        collection(db, 'posts'),
        where('published', '==', true),
        orderBy('created_at', 'desc'),
        limit((currentPage - 1) * POSTS_PER_PAGE)
      );
      const skipSnap = await getDocs(skipQuery);
      const lastDoc = skipSnap.docs[skipSnap.docs.length - 1];
      if (lastDoc) {
        q = query(
          collection(db, 'posts'),
          where('published', '==', true),
          orderBy('created_at', 'desc'),
          startAfter(lastDoc),
          limit(POSTS_PER_PAGE)
        );
      }
    }

    const snapshot = await getDocs(q);
    posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: doc.data().updated_at || '',
    })) as Post[];
  } catch {
    console.warn('Firebase not configured — returning empty posts');
  }

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1
          className="text-3xl font-bold gradient-pink-text mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Categories
        </h1>
        <p className="text-sm text-text-light" style={{ fontFamily: 'var(--font-serif)' }}>
          Browse posts by topic
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <CategoryFilter />
      </div>

      <hr className="section-divider" />

      <div className="mt-8">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-light" style={{ fontFamily: 'var(--font-serif)' }}>
              No posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div>
              {posts.map((post: Post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/categories" />
          </>
        )}
      </div>
    </div>
  );
}
