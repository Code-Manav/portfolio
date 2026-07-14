import React, { useRef, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import IntroImage from '../assets/intro-bg.jpg';
import { TextReveal } from './';
import { isTouchDevice } from '../lib/isTouchDevice';

const r = (a: number, b: number) => Math.random() * (b - a) + a;

const bgParticles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: r(2, 98),
  y: r(2, 98),
  size: r(2, 5),
  delay: r(0, 6),
  duration: r(7, 14),
}));

const magneticButton = (ref: React.RefObject<HTMLDivElement | null>, x: number, y: number, strength = 6) => {
  if (!ref.current) return { x: 0, y: 0 };
  const rect = ref.current.getBoundingClientRect();
  const dx = x - (rect.left + rect.width / 2);
  const dy = y - (rect.top + rect.height / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 120) return { x: 0, y: 0 };
  const factor = (1 - dist / 120) * strength;
  return { x: dx * factor / (dist || 1), y: dy * factor / (dist || 1) };
};

const HeroImage: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const btn1Ref = useRef<HTMLDivElement>(null);
  const btn2Ref = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothX = useSpring(tiltX, { stiffness: 200, damping: 25 });
  const smoothY = useSpring(tiltY, { stiffness: 200, damping: 25 });

  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);
  const sX = useSpring(spotlightX, { stiffness: 100, damping: 20 });
  const sY = useSpring(spotlightY, { stiffness: 100, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      tiltY.set(-dx * 3);
      tiltX.set(dy * 3);
      spotlightX.set(((e.clientX - rect.left) / rect.width) * 100);
      spotlightY.set(((e.clientY - rect.top) / rect.height) * 100);
      setMousePos({ x: e.clientX, y: e.clientY });
    },
    [tiltX, tiltY, spotlightX, spotlightY],
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    tiltX.set(0);
    tiltY.set(0);
    spotlightX.set(50);
    spotlightY.set(50);
  }, [tiltX, tiltY, spotlightX, spotlightY]);

  const btn1Offset = useMemo(() => isTouchDevice ? { x: 0, y: 0 } : magneticButton(btn1Ref, mousePos.x, mousePos.y), [mousePos]);
  const btn2Offset = useMemo(() => isTouchDevice ? { x: 0, y: 0 } : magneticButton(btn2Ref, mousePos.x, mousePos.y, 5), [mousePos]);
  const badgeOffset = useMemo(() => isTouchDevice ? { x: 0, y: 0 } : magneticButton(badgeRef, mousePos.x, mousePos.y, 4), [mousePos]);

  const nameLetters = 'MANAV'.split('');

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ── Ken Burns background ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY, scale: bgScale }}
      >
        <motion.img
          src={IntroImage}
          alt="background"
          className="w-full h-full object-cover opacity-15"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.15 }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="absolute inset-0 bg-linear-to-b from-background/15 via-background/75 to-background"
          style={{ opacity: useTransform(scrollYProgress, [0, 1], [1, 0.7]) }}
        />

        {/* Scan-line overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-[0.012]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--ac)) 2px, hsl(var(--ac)) 3px)',
            backgroundSize: '100% 6px',
          }}
          animate={{ backgroundPosition: ['0 0', '0 12px'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' as const }}
        />
      </motion.div>

      {/* ── Ambient particles ── */}
      {bgParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'hsl(var(--ac) / 0.06)',
            boxShadow: `0 0 ${p.size * 4}px hsl(var(--ac) / 0.03)`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.15, 0.5, 0.15],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut' as const,
          }}
        />
      ))}

      {/* ── Cursor spotlight ── */}
      <motion.div
        className="absolute pointer-events-none z-[1] w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: `${sX.get()}%`,
          top: `${sY.get()}%`,
          background: 'radial-gradient(circle, hsl(var(--ac) / 0.06), transparent 70%)',
        }}
      />

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 px-6 max-w-5xl mx-auto pt-24 md:pt-0 w-full"
        style={{
          y: contentY,
          opacity: contentOpacity,
          rotateX: smoothX,
          rotateY: smoothY,
          transformPerspective: 1200,
        }}
      >
        {/* Badge */}
        <motion.div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-black tracking-widest uppercase mb-10 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ x: badgeOffset.x, y: badgeOffset.y }}
          whileHover={{ scale: 1.05, borderColor: 'hsl(var(--ac) / 0.6)', boxShadow: '0 0 30px hsl(var(--ac) / 0.15)' }}
        >
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{
              background: 'radial-gradient(circle at 50% 50%, hsl(var(--ac) / 0.12), transparent 70%)',
            }}
          />
          <motion.span className="relative z-10 flex items-center gap-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-accent inline-block"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
            />
            Senior Full-Stack Engineer
          </motion.span>
        </motion.div>

        {/* Heading */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-foreground mb-8">
          <TextReveal text="HI, I'M " delay={0.4} />
          <span className="text-accent inline-flex gap-1">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block relative"
                initial={{ opacity: 0, y: -30, rotateZ: -10 }}
                animate={{ opacity: 1, y: 0, rotateZ: 0 }}
                transition={{ delay: 0.5 + i * 0.07, type: 'spring' as const, stiffness: 250, damping: 14 }}
                whileHover={{
                  scale: 1.15,
                  color: 'hsl(var(--ac) / 0.7)',
                  transition: { type: 'spring' as const, stiffness: 400, damping: 8 },
                }}
              >
                {letter}
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-accent/60 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25 }}
                />
              </motion.span>
            ))}
          </span>
          <TextReveal text=" SHORI." delay={0.8} />
        </h1>

        {/* Subtext */}
        <motion.p
          className="text-xl md:text-2xl text-muted font-light leading-relaxed max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Senior Full-Stack Software Engineer with 4.5+ years of experience designing and building{' '}
          <motion.span
            className="text-foreground font-bold relative inline-block"
            whileHover={{ scale: 1.03 }}
          >
            production-ready
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-[3px] bg-accent rounded-full origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' as const }}
            />
          </motion.span>
          {' '}web applications. I specialize in React, Next.js, and Node.js architecting scalable backend systems, crafting intuitive frontends, and deploying cloud-native solutions on AWS and Azure.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {/* Explore Work */}
          <motion.div
            ref={btn1Ref}
            style={{ x: btn1Offset.x, y: btn1Offset.y }}
            transition={{ type: 'spring' as const, stiffness: 150, damping: 15 }}
          >
            <Link to="/project"
              className="btn btn-primary min-w-[200px] relative overflow-hidden group"
            >
              <motion.span
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' as const }}
              />
              <motion.span className="relative z-10 flex items-center gap-2 justify-center">
                Explore Work
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.5 }}
                >
                  →
                </motion.span>
              </motion.span>
            </Link>
          </motion.div>

          {/* Let's Collaborate */}
          <motion.div
            ref={btn2Ref}
            style={{ x: btn2Offset.x, y: btn2Offset.y }}
            transition={{ type: 'spring' as const, stiffness: 150, damping: 15 }}
          >
            <Link to="/contact"
              className="btn btn-outline min-w-[200px] relative overflow-hidden group"
            >
              <motion.span
                className="absolute inset-0 bg-linear-to-r from-transparent via-accent/10 to-transparent pointer-events-none"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' as const }}
              />
              <span className="relative z-10">Let's Collaborate</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Animated glow orbs (mouse-following) ── */}
      <motion.div
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
        style={{ y: orb1Y }}
        animate={{
          x: [0, 25, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        }}
      />
      <motion.div
        className="absolute top-[20%] right-[20%] w-64 h-64 bg-accent/6 rounded-full blur-3xl pointer-events-none"
        style={{ y: orb2Y }}
        animate={{
          x: [0, -20, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut' as const,
          delay: 1.5,
        }}
      />
      <motion.div
        className="absolute top-[60%] left-[10%] w-40 h-40 bg-accent/4 rounded-full blur-3xl pointer-events-none"
        animate={{
          x: [0, 15, 0],
          y: [0, -15, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut' as const,
          delay: 0.8,
        }}
      />

      {/* ── Enhanced scroll hint ── */}
      <motion.div
        className="absolute bottom-10 right-10 hidden lg:flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <motion.span
          className="text-[9px] font-black text-accent/40 uppercase tracking-[0.35em]"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const }}
        >
          Scroll
        </motion.span>
        <motion.div
          className="w-6 h-11 border-2 border-accent/15 rounded-full flex justify-center pt-2 relative"
          animate={{ borderColor: ['hsl(var(--ac) / 0.1)', 'hsl(var(--ac) / 0.3)', 'hsl(var(--ac) / 0.1)'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const }}
        >
          <motion.div
            className="w-1.5 h-2.5 bg-accent rounded-full"
            animate={{ y: [0, 4, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
          />
          {/* Inner glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ boxShadow: ['inset 0 0 4px hsl(var(--ac) / 0)', 'inset 0 0 8px hsl(var(--ac) / 0.1)', 'inset 0 0 4px hsl(var(--ac) / 0)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeroImage;
