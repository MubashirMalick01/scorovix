import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Calendar, Clock, ArrowRight } from 'lucide-react';
import { getAllPosts, getPost, getRelatedPosts, SITE_URL } from '@/lib/posts';
import ShareButton from '@/components/ui/ShareButton';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Article Not Found' };
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: { absolute: post.metaTitle },
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.metaTitle,
      description: post.metaDescription,
      url,
      publishedTime: post.dateISO,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const related = getRelatedPosts(post.slug, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'Scorovix', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Scorovix', url: SITE_URL },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  // Split the body so we can inject a CTA roughly in the middle (after a section).
  const sections = post.body.split('<h2>');
  let bodyTop = post.body;
  let bodyBottom = '';
  if (sections.length > 2) {
    const mid = Math.ceil((sections.length - 1) / 2);
    bodyTop = sections.slice(0, mid + 1).join('<h2>');
    bodyBottom = '<h2>' + sections.slice(mid + 1).join('<h2>');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-[12px] text-text-secondary">
        <Link href="/" className="transition-colors hover:text-gold">Home</Link>
        <ChevronRight size={13} />
        <Link href="/blog" className="transition-colors hover:text-gold">Blog</Link>
        <ChevronRight size={13} />
        <span className="line-clamp-1 text-text-primary">{post.title}</span>
      </nav>

      <div className="mb-4 flex items-center gap-3">
        <span className="inline-block rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold">
          {post.category}
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] text-text-secondary"><Calendar size={12} /> {post.date}</span>
        <span className="inline-flex items-center gap-1 text-[12px] text-text-secondary"><Clock size={12} /> {post.readTime}</span>
      </div>

      <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{post.h1}</h1>

      <div className="my-5 flex items-center justify-between border-y border-subtle py-3">
        <span className="text-sm text-text-secondary">By Scorovix</span>
        <ShareButton url={url} />
      </div>

      {/* Article body */}
      <article className="article-body">
        <div dangerouslySetInnerHTML={{ __html: bodyTop }} />

        {/* Mid-article CTA */}
        <div className="my-8 flex flex-col items-start gap-3 rounded-2xl border border-gold/30 bg-gold/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-cardtitle font-semibold text-text-primary">Predict this match yourself</div>
            <div className="text-sm text-text-secondary">Run your own win probabilities and score prediction with Scorovix.</div>
          </div>
          <Link
            href="/predict"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl gold-gradient px-5 py-2.5 text-sm font-bold text-bg-primary transition-transform hover:scale-105 active:scale-95"
          >
            Predict this match <ArrowRight size={15} />
          </Link>
        </div>

        {bodyBottom && <div dangerouslySetInnerHTML={{ __html: bodyBottom }} />}
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-section font-semibold">Related Articles</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="card group p-4">
                <span className="inline-block rounded-full bg-gold/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold">
                  {r.category}
                </span>
                <h3 className="mt-2 text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-gold">
                  {r.title}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-text-secondary">
                  <Clock size={11} /> {r.readTime}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-gold transition-all hover:gap-2">
          ← Back to all articles
        </Link>
      </div>
    </div>
  );
}
