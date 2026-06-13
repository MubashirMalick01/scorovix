export const metadata = {
  title: { absolute: 'World Cup 2026 Bracket & Group Standings — Scorovix' },
  description:
    'Live FIFA World Cup 2026 group standings and knockout bracket. AI tournament simulator predicts who wins the World Cup.',
  keywords: ['world cup 2026 bracket', 'world cup 2026 standings', 'world cup 2026 groups table'],
  alternates: { canonical: '/bracket' },
  openGraph: {
    title: 'World Cup 2026 Bracket & Group Standings — Scorovix',
    description:
      'Live FIFA World Cup 2026 group standings and knockout bracket. AI tournament simulator predicts who wins the World Cup.',
    url: 'https://www.scorovix.com/bracket',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Cup 2026 Bracket & Group Standings — Scorovix',
    description: 'Live FIFA World Cup 2026 group standings and knockout bracket with a tournament simulator.',
  },
};

export default function BracketLayout({ children }) {
  return children;
}
