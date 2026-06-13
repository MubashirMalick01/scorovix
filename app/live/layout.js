export const metadata = {
  title: { absolute: 'Live World Cup 2026 Scores & Predictions — Scorovix' },
  description:
    'Live FIFA World Cup 2026 scores updated every 30 seconds. In-play predictions, next goal probability and real-time match stats.',
  keywords: ['world cup 2026 live score', 'fifa world cup live', 'world cup live today'],
  alternates: { canonical: '/live' },
  openGraph: {
    title: 'Live World Cup 2026 Scores & Predictions — Scorovix',
    description:
      'Live FIFA World Cup 2026 scores updated every 30 seconds. In-play predictions, next goal probability and real-time match stats.',
    url: 'https://www.scorovix.com/live',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live World Cup 2026 Scores & Predictions — Scorovix',
    description: 'Live FIFA World Cup 2026 scores updated every 30 seconds. In-play predictions and real-time match stats.',
  },
};

export default function LiveLayout({ children }) {
  return children;
}
