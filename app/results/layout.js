export const metadata = {
  title: { absolute: 'World Cup 2026 Results & Scores — Scorovix' },
  description:
    'All FIFA World Cup 2026 match results and final scores updated in real-time after every match.',
  keywords: ['world cup 2026 results', 'world cup 2026 scores today'],
  alternates: { canonical: '/results' },
  openGraph: {
    title: 'World Cup 2026 Results & Scores — Scorovix',
    description: 'All FIFA World Cup 2026 match results and final scores updated in real-time after every match.',
    url: 'https://www.scorovix.com/results',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Cup 2026 Results & Scores — Scorovix',
    description: 'All FIFA World Cup 2026 match results and final scores updated in real-time after every match.',
  },
};

export default function ResultsLayout({ children }) {
  return children;
}
