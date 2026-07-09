import React, { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const dots: Dot[] = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 4 + Math.random() * 6,
  delay: Math.random() * 4,
  duration: 2.5 + Math.random() * 2.5,
}));

const BackgroundParticles: React.FC = memo(() => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // When the route changes, immediately mount the particles so they are 
    // visible during the page crossfade transition.
    setIsVisible(true);

    // The page transition in App.tsx takes ~0.9 seconds total (0.45s out, 0.45s in).
    // We unmount these 80 particles after 1.5 seconds when the new page is fully opaque.
    // This reduces the CPU/GPU calculation cost to 0% for 99% of the user's visit!
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // If we aren't currently transitioning pages, don't render anything.
  // This physically removes the 80 loops from the browser, saving massive performance.
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -2 }}>
      {dots.map(d => (
        <motion.div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            marginLeft: -d.size / 2,
            marginTop: -d.size / 2,
            backgroundColor: 'hsl(var(--ac))',
            boxShadow: '0 0 10px hsl(var(--ac) / 0.7), 0 0 30px hsl(var(--ac) / 0.3), 0 0 60px hsl(var(--ac) / 0.15)',
          }}
          animate={{
            scale: [1, 2.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: d.delay,
          }}
        />
      ))}
    </div>
  );
});

export default BackgroundParticles;
