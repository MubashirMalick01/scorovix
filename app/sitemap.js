import { getAllPosts, SITE_URL } from '@/lib/posts';

export default function sitemap() {
  const lastModified = new Date('2026-06-13');

  const staticRoutes = [
    { url: `${SITE_URL}`, priority: 1.0, changeFrequency: 'daily' },
    { url: `${SITE_URL}/live`, priority: 0.9, changeFrequency: 'hourly' },
    { url: `${SITE_URL}/predict`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${SITE_URL}/bracket`, priority: 0.8, changeFrequency: 'daily' },
    { url: `${SITE_URL}/teams`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/results`, priority: 0.8, changeFrequency: 'daily' },
    { url: `${SITE_URL}/blog`, priority: 0.8, changeFrequency: 'daily' },
    { url: `${SITE_URL}/contact`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/terms`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/privacy`, priority: 0.3, changeFrequency: 'yearly' },
  ].map((r) => ({ ...r, lastModified }));

  const blogRoutes = getAllPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.dateISO),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
