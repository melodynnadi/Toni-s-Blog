'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import type { Comment } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { FiUser, FiClock, FiSend } from 'react-icons/fi';

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'comments'),
        where('post_id', '==', postId),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Comment[];
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        post_id: postId,
        name: name.trim(),
        comment: comment.trim(),
        created_at: serverTimestamp(),
      });
      setName('');
      setComment('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchComments();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
    setSubmitting(false);
  }

  return (
    <section>
      <h3 className="widget-title">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] tracking-[0.1em] uppercase text-text-light mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              maxLength={100}
              className="w-full px-4 py-3 border border-pink-soft text-sm focus:outline-none focus:border-pink-accent transition-colors bg-white rounded-lg"
            />
          </div>

          <div>
            <label className="block text-[11px] tracking-[0.1em] uppercase text-text-light mb-2">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              required
              maxLength={2000}
              rows={4}
              className="w-full px-4 py-3 border border-pink-soft text-sm focus:outline-none focus:border-pink-accent transition-colors bg-white resize-none rounded-lg"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 gradient-pink-btn text-[11px] tracking-[0.15em] uppercase rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiSend size={12} />
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
            {success && (
              <span className="text-sm text-green-600 animate-[fadeIn_0.3s_ease-out]">
                Comment posted!
              </span>
            )}
          </div>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-text border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-light text-sm" style={{ fontFamily: 'var(--font-serif)' }}>
            No comments yet. Be the first to share your thoughts.
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {comments.map((c) => (
            <div
              key={c.id}
              className="py-5 border-b border-border last:border-0 animate-[fadeIn_0.3s_ease-out]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-pink-bg flex items-center justify-center">
                  <FiUser size={14} className="text-text-light" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">
                    {c.name}
                  </p>
                  <p className="text-[10px] text-text-light tracking-wide flex items-center gap-1">
                    <FiClock size={9} />
                    {format(new Date(c.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-light leading-relaxed pl-11" style={{ fontFamily: 'var(--font-serif)' }}>
                {c.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
