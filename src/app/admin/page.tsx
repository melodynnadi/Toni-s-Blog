'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import type { Post } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiEye, FiEyeOff } from 'react-icons/fi';
import { BLOG_NAME, CATEGORY_COLORS } from '@/lib/constants';
import type { User } from 'firebase/auth';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/admin/login');
        return;
      }
      setUser(currentUser);
      fetchPosts();
    });
    return () => unsubscribe();
  }, [router]);

  async function fetchPosts() {
    const q = query(collection(db, 'posts'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      created_at: d.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: d.data().updated_at || '',
    })) as Post[];
    setPosts(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeleting(id);
    await deleteDoc(doc(db, 'posts', id));
    setPosts(posts.filter((p) => p.id !== id));
    setDeleting(null);
  }

  async function togglePublished(post: Post) {
    await updateDoc(doc(db, 'posts', post.id), { published: !post.published });
    setPosts(posts.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)));
  }

  async function handleLogout() {
    await signOut(auth);
    router.push('/admin/login');
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-pink-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Dashboard
          </h1>
          <p className="text-sm text-text-light mt-1" style={{ fontFamily: 'var(--font-body)' }}>
            Manage your blog posts
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/new"
            className="px-5 py-2.5 bg-pink-primary text-white rounded-full text-sm font-medium hover:bg-pink-accent transition-all duration-300 flex items-center gap-2 shadow-md"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <FiPlus size={16} /> New Post
          </Link>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-white text-text rounded-full text-sm font-medium hover:bg-pink-light/50 transition-all duration-300 flex items-center gap-2 border border-pink-light/50"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Posts', value: posts.length },
          { label: 'Published', value: posts.filter((p) => p.published).length },
          { label: 'Drafts', value: posts.filter((p) => !p.published).length },
          { label: 'Categories', value: new Set(posts.map((p) => p.category)).size },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 shadow-sm border border-pink-light/30 text-center"
          >
            <p className="text-2xl font-bold text-pink-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              {stat.value}
            </p>
            <p className="text-xs text-text-light mt-1" style={{ fontFamily: 'var(--font-body)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-pink-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-2xl">
          <p className="text-5xl mb-4">✍️</p>
          <p className="text-text-light mb-4" style={{ fontFamily: 'var(--font-body)' }}>
            No posts yet. Start writing!
          </p>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-primary text-white rounded-full text-sm font-medium hover:bg-pink-accent transition-all duration-300"
          >
            <FiPlus size={16} /> Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const categoryColor = CATEGORY_COLORS[post.category] || 'bg-pink-100 text-pink-700';
            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-pink-light/30 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-16 h-32 sm:h-16 rounded-xl bg-pink-light/30 overflow-hidden flex-shrink-0">
                  {post.image ? (
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-light to-pink-accent/20">
                      <span className="text-lg">✿</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="font-semibold text-text truncate"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {post.title}
                    </h3>
                    {!post.published && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 flex-shrink-0">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-light">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${categoryColor}`}>
                      {post.category}
                    </span>
                    <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePublished(post)}
                    className="p-2 rounded-full hover:bg-pink-light/50 text-text-light hover:text-pink-primary transition-all"
                    title={post.published ? 'Unpublish' : 'Publish'}
                  >
                    {post.published ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                  </button>
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="p-2 rounded-full hover:bg-pink-light/50 text-text-light hover:text-pink-primary transition-all"
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="p-2 rounded-full hover:bg-red-50 text-text-light hover:text-red-500 transition-all disabled:opacity-50"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
