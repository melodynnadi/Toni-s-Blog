'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import type { Post } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useParams } from 'next/navigation';
import PostEditor from '@/components/PostEditor';

export default function EditPostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/admin/login');
        return;
      }

      const docSnap = await getDoc(doc(db, 'posts', id));
      if (!docSnap.exists()) {
        router.push('/admin');
        return;
      }
      setPost({
        id: docSnap.id,
        ...docSnap.data(),
        created_at: docSnap.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: docSnap.data().updated_at || '',
      } as Post);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-pink-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  return <PostEditor post={post} />;
}
