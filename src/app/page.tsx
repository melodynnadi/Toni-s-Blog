import { db } from '@/lib/firebase';
import type { Post } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, limit, startAfter, getCountFromServer } from 'firebase/firestore';
import { POSTS_PER_PAGE } from '@/lib/constants';
import BlogCard from '@/components/BlogCard';
import Pagination from '@/components/Pagination';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

interface HomePageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

async function fetchPosts(currentPage: number, searchQuery: string) {
  try {
    let q = query(
      collection(db, 'posts'),
      where('published', '==', true),
      orderBy('created_at', 'desc'),
      limit(POSTS_PER_PAGE)
    );

    const countQuery = query(
      collection(db, 'posts'),
      where('published', '==', true)
    );
    const countSnap = await getCountFromServer(countQuery);
    const totalCount = countSnap.data().count;

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
    let posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: doc.data().updated_at || '',
    })) as Post[];

    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerSearch) ||
          p.excerpt.toLowerCase().includes(lowerSearch) ||
          p.content.toLowerCase().includes(lowerSearch)
      );
    }

    return { posts, totalCount };
  } catch {
    return { posts: [], totalCount: 0 };
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || '';

  const { posts, totalCount } = await fetchPosts(currentPage, searchQuery);
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const remainingPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Featured Post */}
      {featuredPost && currentPage === 1 && !searchQuery && (
        <section className="mb-12">
          <Link href={`/blog/${featuredPost.slug}`} className="block group">
            <div className="relative aspect-[16/9] bg-pink-light overflow-hidden rounded-xl">
              {featuredPost.image ? (
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-pink-bg flex items-center justify-center">
                  <span className="text-6xl opacity-20" style={{ fontFamily: 'var(--font-heading)' }}>&#10047;</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-pink-deep/70 via-pink-accent/40 to-transparent">
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 uppercase tracking-wide leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {featuredPost.title}
                </h2>
                <span className="inline-block px-5 py-2 gradient-pink-btn text-[11px] tracking-[0.15em] uppercase rounded-full">
                  READ MORE
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-6 flex items-center gap-3">
          <p className="text-sm text-text-light">
            Search results for &ldquo;<span className="font-medium text-text">{searchQuery}</span>&rdquo;
          </p>
          <Link href="/" className="text-sm text-pink-accent hover:text-pink-deep transition-colors">
            Clear
          </Link>
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <h2 className="widget-title">
            {searchQuery ? 'Results' : 'Recent Posts'}
          </h2>

          {(!posts || posts.length === 0) ? (
            <div className="text-center py-20">
              <p className="text-text-light" style={{ fontFamily: 'var(--font-serif)' }}>
                {searchQuery ? 'No posts found matching your search.' : 'No posts yet. Check back soon!'}
              </p>
            </div>
          ) : (
            <>
              <div>
                {(searchQuery || currentPage > 1 ? posts : remainingPosts).map((post: Post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
                {posts.length > 0 && remainingPosts.length === 0 && !searchQuery && currentPage === 1 && (
                  <div className="text-center py-12">
                    <p className="text-text-light text-sm" style={{ fontFamily: 'var(--font-serif)' }}>
                      More posts coming soon...
                    </p>
                  </div>
                )}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={searchQuery ? `/?search=${searchQuery}` : '/'}
              />
            </>
          )}
        </main>

        {/* Sidebar */}
        <div className="lg:w-72 shrink-0">
          <Sidebar recentPosts={posts} />
        </div>
      </div>
    </div>
  );
}
