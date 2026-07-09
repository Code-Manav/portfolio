import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FaTimes } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/', scrollId: 'hero' },
  { name: 'Projects', path: '/project', scrollId: 'projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const scrollToSection = (sectionId: string) => {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  return false;
};

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const prevY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setVisible(y < prevY.current || y < 10);
      prevY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-transform duration-300 ${
          (visible || open) ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Navbar Header Bar */}
        <div 
          className={`relative z-[101] transition-all duration-300 ${
            scrolled && !open ? 'glass py-3' : 'bg-transparent py-5 border-none shadow-none'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Link to="/" className="text-2xl font-black tracking-tighter text-foreground relative group">
              MANAV<span className="text-accent">.</span>
            </Link>

            {/* Desktop Links */}
            <ul className="hidden md:flex items-center gap-1 list-none">
              {navLinks.map(l => {
                const isActive = location.pathname === l.path;
                const isHome = location.pathname === '/';
                const handleClick = (e: React.MouseEvent) => {
                  if (isHome && l.scrollId) {
                    e.preventDefault();
                    scrollToSection(l.scrollId);
                  }
                };
                return (
                  <li key={l.name}>
                    <Link to={l.path} onClick={handleClick}
                      className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                        isActive ? 'text-accent' : 'text-foreground/70 hover:text-foreground'
                      }`}
                    >
                      {l.name}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-accent/8 rounded-lg -z-0"
                          layoutId="nav-active"
                          transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
                        />
                      )}
                      <span className="absolute -bottom-0 left-1/2 h-[2px] bg-accent/60 rounded-full -translate-x-1/2 w-0 group-hover:w-[60%] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </Link>
                  </li>
                );
              })}
              <li className="ml-2"><ThemeToggle /></li>
            </ul>

            {/* Mobile Toggle Button */}
            <div className="flex md:hidden items-center gap-4">
              <ThemeToggle />
              <motion.button
                onClick={() => setOpen(!open)}
                className="text-2xl text-foreground bg-transparent border-none cursor-pointer p-2 outline-none relative"
                aria-label="Toggle menu"
                whileTap={{ scale: 0.8, rotate: 90 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                {open ? <FaTimes /> : <GiHamburgerMenu />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay with Premium Animations */}
        <AnimatePresence>
          {open && (
            <motion.div 
              className="fixed inset-0 w-full h-screen bg-background flex flex-col items-center justify-center gap-8 md:hidden z-[90] overflow-hidden"
              initial={{ clipPath: 'circle(0px at 90% 40px)' }}
              animate={{ clipPath: 'circle(150% at 90% 40px)' }}
              exit={{ clipPath: 'circle(0px at 90% 40px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Floating Decorative Background Text */}
              <motion.div 
                className="absolute text-[25vw] font-black text-foreground/[0.03] whitespace-nowrap pointer-events-none select-none"
                initial={{ x: '100%' }}
                animate={{ x: '-100%' }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              >
                NAVIGATION MENU
              </motion.div>
              <motion.div 
                className="absolute top-[20%] text-[20vw] font-black text-accent/[0.03] whitespace-nowrap pointer-events-none select-none outline-text"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                MANAV SHORI
              </motion.div>

              <motion.div 
                className="flex flex-col items-center justify-center gap-8 relative z-10 w-full px-8"
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
                  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                }}
              >
                {navLinks.map((l) => {
                  const isActive = location.pathname === l.path;
                  const isHome = location.pathname === '/';
                  const handleClick = (e: React.MouseEvent) => {
                    setOpen(false);
                    if (isHome && l.scrollId) {
                      e.preventDefault();
                      setTimeout(() => scrollToSection(l.scrollId), 700);
                    }
                  };
                  
                  return (
                    <motion.div 
                      key={l.name} 
                      className="overflow-hidden w-full max-w-sm"
                      variants={{
                        open: { y: 0, opacity: 1, rotate: 0 },
                        closed: { y: 100, opacity: 0, rotate: 10 }
                      }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                      <Link 
                        to={l.path} 
                        onClick={handleClick}
                        className="block relative group text-center"
                      >
                        <motion.span
                          className={`block text-5xl sm:text-6xl font-black tracking-tighter transition-colors duration-300 ${
                            isActive ? 'text-accent' : 'text-foreground'
                          }`}
                          whileHover={{ scale: 1.1, x: 20, skewX: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {l.name}
                          {/* Animated underline reveal on hover */}
                          <span className="absolute left-1/4 right-1/4 bottom-2 h-3 bg-accent/30 -z-10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                        </motion.span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
