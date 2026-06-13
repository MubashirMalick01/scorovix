// Blog post data access. Posts live in /data/posts.json.
import data from '../data/posts.json';

const POSTS = (data.posts || []).slice();

export const SITE_URL = 'https://www.scorovix.com';

export function getAllPosts() {
  // Newest first by dateISO.
  return [...POSTS].sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
}

export function getFeaturedPost() {
  return POSTS.find((p) => p.featured) || getAllPosts()[0] || null;
}

export function getPost(slug) {
  return POSTS.find((p) => p.slug === slug) || null;
}

export function getRelatedPosts(slug, count = 3) {
  const current = getPost(slug);
  if (!current) return getAllPosts().slice(0, count);
  const sameCat = getAllPosts().filter((p) => p.slug !== slug && p.category === current.category);
  const others = getAllPosts().filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCat, ...others].slice(0, count);
}

export const CATEGORIES = ['All', 'Match Analysis', 'Preview', 'Tournament'];
