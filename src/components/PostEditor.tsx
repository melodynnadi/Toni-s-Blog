'use client';

import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import type { Post } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CATEGORIES, AUTHOR_NAME } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiSave, FiEye, FiEdit2, FiImage } from 'react-icons/fi';

interface PostEditorProps {
  post?: Post;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function PostEditor({ post }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [category, setCategory] = useState(post?.category || CATEGORIES[0]);
  const [image, setImage] = useState(post?.image || '');
  const [published, setPublished] = useState(post?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, GIF, and WebP images are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }

    setUploading(true);
    setError('');

    const fileExt = file.name.split('.').pop();
    const fileName = `blog-images/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    try {
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImage(url);
    } catch (err) {
      setError('Failed to upload image. Make sure Firebase Storage is configured.');
    }
    setUploading(false);
  }

  async function handleSave() {
    if (!title.trim() || !content.trim() || !category) {
      setError('Title, content, and category are required.');
      return;
    }

    setSaving(true);
    setError('');

    const slug = generateSlug(title);
    const postData = {
      title: title.trim(),
      slug,
      content,
      excerpt: excerpt.trim() || content.substring(0, 200) + '...',
      category,
      image,
      author: AUTHOR_NAME,
      published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (post) {
        await updateDoc(doc(db, 'posts', post.id), postData);
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          created_at: serverTimestamp(),
        });
      }
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to save post.');
      setSaving(false);
      return;
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-bold text-text"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {post ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-white text-text hover:bg-pink-light/50 border border-pink-light/50 transition-all duration-300 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {preview ? <FiEdit2 size={14} /> : <FiEye size={14} />}
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-full text-sm font-medium bg-pink-primary text-white hover:bg-pink-accent transition-all duration-300 flex items-center gap-2 shadow-md disabled:opacity-50"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <FiSave size={14} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}

      {preview ? (
        /* Preview Mode */
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-pink-light/30">
          {image && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6">
              <img src={image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
            {category}
          </span>
          <h1
            className="text-3xl font-bold text-text mt-3 mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title || 'Untitled Post'}
          </h1>
          <div className="prose-pink" style={{ fontFamily: 'var(--font-body)' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || '*Start writing to see preview...*'}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-1" style={{ fontFamily: 'var(--font-body)' }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your post title"
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl border border-pink-light bg-white text-lg focus:outline-none focus:border-pink-primary focus:ring-2 focus:ring-pink-light transition-all"
              style={{ fontFamily: 'var(--font-heading)' }}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-1" style={{ fontFamily: 'var(--font-body)' }}>
              Excerpt (preview text)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description for the post card..."
              maxLength={500}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-pink-light bg-white text-sm focus:outline-none focus:border-pink-primary focus:ring-2 focus:ring-pink-light transition-all resize-none"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-pink-light bg-white text-sm focus:outline-none focus:border-pink-primary focus:ring-2 focus:ring-pink-light transition-all"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Published */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                Status
              </label>
              <div className="flex items-center gap-3 h-[46px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded border-pink-light text-pink-primary focus:ring-pink-light"
                  />
                  <span className="text-sm text-text" style={{ fontFamily: 'var(--font-body)' }}>
                    Published
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-1" style={{ fontFamily: 'var(--font-body)' }}>
              Cover Image
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Image URL or upload below"
                className="flex-1 px-4 py-3 rounded-xl border border-pink-light bg-white text-sm focus:outline-none focus:border-pink-primary focus:ring-2 focus:ring-pink-light transition-all"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              <label className="px-4 py-3 rounded-xl border border-pink-light bg-white text-sm text-text-light hover:bg-pink-light/30 transition-all cursor-pointer flex items-center gap-2 justify-center flex-shrink-0">
                <FiImage size={14} />
                {uploading ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            {image && (
              <div className="mt-3 aspect-[16/9] max-w-xs rounded-xl overflow-hidden border border-pink-light/30">
                <img src={image} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-1" style={{ fontFamily: 'var(--font-body)' }}>
              Content (Markdown supported)
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
              {[
                { label: 'B', md: '**bold**' },
                { label: 'I', md: '*italic*' },
                { label: 'H2', md: '\n## Heading\n' },
                { label: 'H3', md: '\n### Subheading\n' },
                { label: 'Link', md: '[text](url)' },
                { label: 'Image', md: '![alt](url)' },
                { label: 'Quote', md: '\n> quote\n' },
                { label: 'List', md: '\n- item\n' },
                { label: 'Code', md: '`code`' },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => setContent(content + btn.md)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-pink-light/30 text-text-light hover:bg-pink-light hover:text-pink-primary transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post in Markdown..."
              rows={20}
              className="w-full px-4 py-3 rounded-xl border border-pink-light bg-white text-sm focus:outline-none focus:border-pink-primary focus:ring-2 focus:ring-pink-light transition-all resize-y font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
}
