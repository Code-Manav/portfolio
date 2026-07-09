import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SkillBarProps {
  skill: string;
  level: number;
  delay?: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ skill, level, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const steps = 30;
    let current = 0;
    const interval = setInterval(() => {
      current++;
      const p = current / steps;
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * level));
      if (current >= steps) {
        clearInterval(interval);
        setCount(level);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [inView, level]);

  return (
    <motion.div
      ref={ref}
      className="mb-4 group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex justify-between mb-2">
        <motion.span
          className="text-sm font-semibold text-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.1 }}
        >
          {skill}
        </motion.span>
        <motion.span
          className="text-sm font-semibold text-accent tabular-nums"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2 }}
        >
          {count}%
        </motion.span>
      </div>
      <div className="h-2.5 bg-foreground/8 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full rounded-full relative"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: 'easeOut' as const }}
        >
          {/* Gradient fill */}
          <motion.div
            className="absolute inset-0 rounded-full bg-linear-to-r from-accent/70 via-accent to-accent/80"
          />
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 rounded-full bg-linear-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' as const, delay: delay + 0.5 }}
          />
          {/* Glow */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent"
            animate={{
              boxShadow: [
                '0 0 4px hsl(var(--ac) / 0.4)',
                '0 0 10px hsl(var(--ac) / 0.7)',
                '0 0 4px hsl(var(--ac) / 0.4)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SkillBar;
