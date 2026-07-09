import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-full glass cursor-pointer relative overflow-hidden"
      aria-label="Toggle dark/light mode"
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring' as const, stiffness: 400, damping: 15 }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.span
            key="sun"
            className="flex"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3, ease: 'easeInOut' as const }}
          >
            <FaSun style={{ color: '#facc15', fontSize: '1.1rem' }} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            className="flex"
            initial={{ y: -20, opacity: 0, rotate: 90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: -90 }}
            transition={{ duration: 0.3, ease: 'easeInOut' as const }}
          >
            <FaMoon style={{ color: '#334155', fontSize: '1.1rem' }} />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Ripple on click */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ scale: 0, opacity: 0.3 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        style={{ background: 'hsl(var(--ac) / 0.15)' }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
