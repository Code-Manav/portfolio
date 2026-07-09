import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useMotionTemplate } from 'framer-motion';

// OPTIMIZATION: Isolate the Particle System into its own component.
// Why? Particles require updating React state (setParticles) constantly. 
// By isolating this, the heavy layered orbs in MouseFollower won't be 
// forced to re-render 60 times a second every time a particle spawns.
const ParticleTrail: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([]);
  const particleIdRef = useRef(0);

  useEffect(() => {
    let lastTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle particle generation slightly to ~30fps to prevent DOM overload
      const now = performance.now();
      if (now - lastTime < 30) return;
      lastTime = now;

      if (Math.random() > 0.4) {
        const newParticle = {
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 8 + 4,
          color: `hsl(${Math.random() * 60 + 180}, 80%, 60%)`,
        };
        
        // Add new particle
        setParticles(prev => [...prev.slice(-15), newParticle]);

        // Clean up particle memory after animation finishes
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'fixed',
            left: particle.x,
            top: particle.y,
            pointerEvents: 'none',
            zIndex: 9996,
            width: particle.size,
            height: particle.size,
            background: particle.color,
            willChange: 'transform, opacity'
          }}
          className="rounded-full translate-x-[-50%] translate-y-[-50%]"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 0, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        />
      ))}
    </AnimatePresence>
  );
};

const MouseFollower: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const hue = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [199, 280]);
  const saturation = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [70, 90]);

  // Framer motion uses CSS variables natively here without triggering React renders
  const bgMain = useMotionTemplate`hsla(${hue}, ${saturation}%, 50%, 0.12)`;
  const bgSecondary = useMotionTemplate`hsla(${useTransform(hue, h => h + 60)}, ${saturation}%, 60%, 0.15)`;
  const bgTertiary = useMotionTemplate`hsla(${useTransform(hue, h => h + 120)}, ${saturation}%, 70%, 0.1)`;
  const bgCore = useMotionTemplate`hsla(${hue}, ${saturation}%, 70%, 0.9)`;
  const borderRing = useMotionTemplate`hsla(${hue}, ${saturation}%, 60%, 0.3)`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // requestAnimationFrame ensures x/y coordinate updates sync perfectly with your monitor's refresh rate
      requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };

    const handleMouseOver = () => setIsHovering(true);
    const handleMouseOut = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <AnimatePresence>
        {isHovering && (
          <>
            {/* The particle trail is now safely isolated in its own component */}
            <ParticleTrail />

            {/* Main glow orb - larger and more dramatic */}
            <motion.div
              style={{
                position: 'fixed', left: 0, top: 0, x, y,
                translateX: '-50%', translateY: '-50%', pointerEvents: 'none', zIndex: 9999,
                background: bgMain,
                willChange: 'transform' // Force Hardware Acceleration on the blur
              }}
              className="w-48 h-48 rounded-full blur-3xl"
              animate={{ scale: [1, 1.4, 1], rotate: [0, 90, 180] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Secondary glow orb - different color */}
            <motion.div
              style={{
                position: 'fixed', left: 0, top: 0, x, y,
                translateX: '-50%', translateY: '-50%', pointerEvents: 'none', zIndex: 9998,
                background: bgSecondary,
                willChange: 'transform'
              }}
              className="w-32 h-32 rounded-full blur-2xl"
              animate={{ scale: [1, 0.7, 1], rotate: [180, 90, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Tertiary glow orb - smaller */}
            <motion.div
              style={{
                position: 'fixed', left: 0, top: 0, x, y,
                translateX: '-50%', translateY: '-50%', pointerEvents: 'none', zIndex: 9997,
                background: bgTertiary,
                willChange: 'transform'
              }}
              className="w-24 h-24 rounded-full blur-xl"
              animate={{ scale: [0.8, 1.2, 0.8], rotate: [360, 180, 360] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Inner core - bright center */}
            <motion.div
              style={{
                position: 'fixed', left: 0, top: 0, x, y,
                translateX: '-50%', translateY: '-50%', pointerEvents: 'none', zIndex: 10000,
                background: bgCore,
                willChange: 'transform'
              }}
              className="w-3 h-3 rounded-full blur-sm"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Outer ring */}
            <motion.div
              style={{
                position: 'fixed', left: 0, top: 0, x, y,
                translateX: '-50%', translateY: '-50%', pointerEvents: 'none', zIndex: 9996,
                borderColor: borderRing,
                willChange: 'transform'
              }}
              className="w-16 h-16 rounded-full border-2"
              animate={{ scale: [1, 1.5, 1], rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MouseFollower;
