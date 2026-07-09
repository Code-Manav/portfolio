import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import ReactGA from 'react-ga4';
import { Home, About, Project, Contact, NotFound } from './routes';
import { ScrollToTop, MouseFollower, BackgroundParticles } from './components';

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
if (GA_TRACKING_ID) {
  ReactGA.initialize(GA_TRACKING_ID);
}

const RouteScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (GA_TRACKING_ID) {
      ReactGA.send({ hitType: 'pageview', page: pathname });
    }
  }, [pathname]);
  return null;
};

const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98, filter: 'blur(4px)' as const },
  in: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  out: { opacity: 0, y: -20, scale: 0.98, filter: 'blur(4px)' as const },
};

const pageTransition = {
  duration: 0.45,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

const App: React.FC = () => {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  return (
    <>
      {/* Global scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[100] origin-left"
        style={{ scaleX }}
      />

      <BackgroundParticles />
      <MouseFollower />
      <RouteScrollToTop />
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/project" element={<Project />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default App;
