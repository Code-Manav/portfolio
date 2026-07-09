import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  useEffect(() => {
    const toggleVisibility = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const start = window.scrollY;
    const duration = 800;
    const startTime = performance.now();

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start * (1 - ease(progress)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center"
          aria-label="Scroll to top"
          initial={{ scale: 0, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 40 }}
          transition={{ type: 'spring' as const, stiffness: 400, damping: 20 }}
          onMouseEnter={() => y.set(-4)}
          onMouseLeave={() => y.set(0)}
          style={{ y }}
        >
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
            <motion.circle
              cx="28" cy="28" r="26"
              fill="none"
              stroke="hsl(var(--ac) / 0.15)"
              strokeWidth="2"
            />
            <motion.circle
              cx="28" cy="28" r="26"
              fill="none"
              stroke="hsl(var(--ac))"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: scaleX, rotate }}
            />
          </svg>

          {/* Button */}
          <motion.div
            className="glass p-3.5 rounded-full text-accent text-lg shadow-lg relative z-10"
            whileHover={{ scale: 1.1, boxShadow: '0 0 30px hsl(var(--ac) / 0.3)' }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 15 }}
          >
            <motion.span
              className="flex"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
            >
              <FaArrowUp />
            </motion.span>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
