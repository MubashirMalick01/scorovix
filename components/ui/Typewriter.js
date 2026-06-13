'use client';

import { useEffect, useState } from 'react';

// Typewriter text effect, 30ms per char by default.
export default function Typewriter({ text = '', speed = 30, className = '', onDone }) {
  const [shown, setShown] = useState('');

  useEffect(() => {
    setShown('');
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone && onDone();
      }
    }, speed);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  return (
    <span className={className}>
      {shown}
      {shown.length < text.length && (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-gold align-middle" />
      )}
    </span>
  );
}
