import HomeClient from './home-client';

export const metadata = {
  title: { absolute: 'World Cup 2026 Predictions | Live Scores & AI Analysis — Scorovix' },
  description:
    'Free FIFA World Cup 2026 predictions powered by real match data. Live scores, group standings and match analysis for all 48 teams and 104 matches.',
  keywords: ['world cup 2026 predictions', 'fifa world cup 2026', 'world cup live scores'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'World Cup 2026 Predictions | Live Scores & AI Analysis — Scorovix',
    description:
      'Free FIFA World Cup 2026 predictions powered by real match data. Live scores, group standings and match analysis for all 48 teams and 104 matches.',
    url: 'https://www.scorovix.com/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Cup 2026 Predictions | Live Scores & AI Analysis — Scorovix',
    description:
      'Free FIFA World Cup 2026 predictions powered by real match data. Live scores, group standings and match analysis for all 48 teams and 104 matches.',
  },
};

export default function Page() {
  return <HomeClient />;
}
