import React, { useRef, useMemo, useCallback, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { isTouchDevice } from '../lib/isTouchDevice';

interface Hero2Props {
  heading: string;
  text: string;
  img: string;
}

/* ─── Utils ─── */
const r = (a: number, b: number) => Math.random() * (b - a) + a;

/* ─── Floating particles ─── */
const bgParticles = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: r(2, 98),
  y: r(2, 98),
  size: r(2, 6),
  delay: r(0, 6),
  duration: r(8, 16),
}));

/* ─── Decorative corner accents ─── */
const CornerAccent: React.FC<{ pos: 'tl' | 'tr' | 'bl' | 'br'; delay: number }> = ({
  pos,
  delay,
}) => {
  const styles: Record<string, string> = {
    tl: 'top-8 left-8',
    tr: 'top-8 right-8',
    bl: 'bottom-8 left-8',
    br: 'bottom-8 right-8',
  };
  const rots: Record<string, string> = { tl: 'rotate-0', tr: 'rotate-90', bl: '-rotate-90', br: 'rotate-180' };
  return (
    <motion.svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      className={`absolute ${styles[pos]} ${rots[pos]} pointer-events-none z-20`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, type: 'spring' as const, stiffness: 200, damping: 16 }}
    >
      <motion.path
        d="M26 2 H2 V26"
        fill="none"
        stroke="hsl(var(--ac) / 0.25)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeInOut' as const }}
      />
    </motion.svg>
  );
};

/* ─── Hero2 ─── */
const Hero2: React.FC<Hero2Props> = ({ heading, text, img }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  /* ── Scroll-driven transforms ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const blurCircleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.7]);

  /* ── 3D Tilt ── */
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 250, damping: 25 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 250, damping: 25 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      tiltY.set(-((e.clientX - cx) / (rect.width / 2)) * 4);
      tiltX.set(((e.clientY - cy) / (rect.height / 2)) * 4);
    },
    [tiltX, tiltY],
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    tiltX.set(0);
    tiltY.set(0);
  }, [tiltX, tiltY]);

  /* ── Letter data ── */
  const chars = useMemo(() => heading.split(''), [heading]);
  const words = useMemo(() => text.split(' '), [text]);

  /* ── Heading container variants ── */
  const headingContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.028, delayChildren: 0.15 },
    },
  };

  const headingChild = {
    hidden: { opacity: 0, y: 50, rotateZ: -8, scale: 0.6 },
    visible: {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 180, damping: 14 },
    },
  };

  const textWord = {
    hidden: { opacity: 0, y: 20, filter: 'blur(6px)' as const },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { delay: 0.4 + i * 0.035, duration: 0.5, ease: 'easeOut' as const },
    }),
  };

  return (
    <motion.section
      ref={sectionRef}
      className="relative h-[65vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ── Ken Burns background ── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, scale: bgScale }}
      >
        <motion.img
          src={img}
          alt={heading}
          className="w-full h-full object-cover opacity-15"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="absolute inset-0 bg-linear-to-b from-background/20 via-background/80 to-background"
          style={{ opacity: overlayOpacity }}
        />

        {/* Animated scan-line overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--ac)) 2px, hsl(var(--ac)) 3px)',
            backgroundSize: '100% 6px',
          }}
          animate={{ backgroundPosition: ['0 0', '0 12px'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' as const }}
        />
      </motion.div>

      {/* ── Corner accents ── */}
      <CornerAccent pos="tl" delay={0.1} />
      <CornerAccent pos="tr" delay={0.25} />
      <CornerAccent pos="bl" delay={0.4} />
      <CornerAccent pos="br" delay={0.55} />

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
            background: 'hsl(var(--ac) / 0.07)',
            boxShadow: `0 0 ${p.size * 3}px hsl(var(--ac) / 0.04)`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut' as const,
          }}
        />
      ))}

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 px-6 pt-24 w-full"
        style={{
          y: contentY,
          opacity: contentOpacity,
          rotateX: smoothTiltX,
          rotateY: smoothTiltY,
          transformPerspective: 1200,
        }}
        onViewportEnter={() => setHasAnimated(true)}
      >
        {/* Heading */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none text-foreground mb-4 overflow-visible"
          variants={headingContainer}
          initial="hidden"
          animate={hasAnimated ? 'visible' : 'hidden'}
        >
          {chars.map((ch, idx) => (
            <motion.span
              key={idx}
              className="inline-block"
              variants={headingChild}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
          <motion.span
            className="text-accent inline-block"
            variants={headingChild}
          >
            .
          </motion.span>
        </motion.h1>

        {/* Subtext word reveal */}
        <motion.p
          className="text-lg md:text-xl text-muted font-light max-w-xl mx-auto"
          initial="hidden"
          animate={hasAnimated ? 'visible' : 'hidden'}
        >
          {words.map((word, idx) => (
            <React.Fragment key={idx}>
              <motion.span
                className="inline-block"
                custom={idx}
                variants={textWord}
              >
                {word}
              </motion.span>
              {idx < words.length - 1 && '\u00A0'}
            </React.Fragment>
          ))}
        </motion.p>

        {/* Animated accent bar */}
        <motion.div
          className="mx-auto mt-8 relative"
          initial={{ width: 0, opacity: 0 }}
          animate={hasAnimated ? { width: 64, opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' as const }}
        >
          <motion.div
            className="h-1.5 bg-accent rounded-full"
            animate={{ boxShadow: ['0 0 6px hsl(var(--ac) / 0.3)', '0 0 16px hsl(var(--ac) / 0.6)', '0 0 6px hsl(var(--ac) / 0.3)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
          />
          {/* Glow sweep */}
          <motion.div
            className="absolute inset-0 h-1.5 bg-linear-to-r from-transparent via-white/30 to-transparent rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' as const, delay: 0.5 }}
          />
        </motion.div>
      </motion.div>

      {/* ── Decorative blur orbs ── */}
      <motion.div
        className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none"
        style={{ y: blurCircleY }}
        animate={{
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        }}
      />
      <motion.div
        className="absolute top-[15%] right-[10%] w-48 h-48 bg-accent/6 rounded-full blur-3xl pointer-events-none"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -60]) }}
        animate={{
          x: [0, -15, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut' as const,
          delay: 1,
        }}
      />

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.span
          className="text-[10px] font-black text-accent/40 uppercase tracking-[0.3em]"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const }}
        >
          Scroll
        </motion.span>
        <motion.div
          className="w-[1px] h-6 bg-linear-to-b from-accent/50 to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
        />
      </motion.div>
    </motion.section>
  );
};

export default Hero2;
