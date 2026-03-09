export const CATEGORIES = [
  'School',
  'Work',
  'Gym',
  'Lifestyle',
  'Personal',
  'Relationships',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  School: 'bg-blue-100 text-blue-700',
  Work: 'bg-purple-100 text-purple-700',
  Gym: 'bg-green-100 text-green-700',
  Lifestyle: 'bg-pink-100 text-pink-700',
  Personal: 'bg-yellow-100 text-yellow-700',
  Relationships: 'bg-red-100 text-red-700',
};

export const BLOG_NAME = "Toni's Blog";
export const BLOG_TAGLINE = 'Thoughts on life, school, fitness, and everything in between.';
export const AUTHOR_NAME = 'Toni';
export const POSTS_PER_PAGE = 6;
