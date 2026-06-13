import { getAllPosts, getFeaturedPost } from '@/lib/posts';
import BlogIndex from '@/components/sections/BlogIndex';

// Trim posts to the metadata the listing needs (no heavy body HTML on the client).
function trim(p) {
  if (!p) return null;
  const { slug, title, metaDescription, excerpt, category, date, readTime, featured } = p;
  return { slug, title, metaDescription, excerpt, category, date, readTime, featured };
}

export default function BlogPage() {
  const posts = getAllPosts().map(trim);
  const featured = trim(getFeaturedPost());
  return <BlogIndex posts={posts} featured={featured} />;
}
