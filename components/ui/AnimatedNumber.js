'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

// Counts up to `value` when scrolled into view (or on mount).
export default function AnimatedNumber({
  value,
  duration = 1.2,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, Number(value) || 0, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
