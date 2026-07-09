import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';

interface WorkCardProps {
  title: string;
  description: string;
  tags: string[];
  featured: boolean;
  imgsrc: string;
}

/* ─── Particle helpers ─── */
interface Particle { id: number; x: number; y: number; vx: number; vy: number; size: number; life: number; maxLife: number; }
let pid = 0;
const spawnParticles = (cx: number, cy: number): Particle[] =>
  Array.from({ length: 3 }, () => ({
    id: pid++, x: cx + (Math.random() - 0.5) * 20, y: cy + (Math.random() - 0.5) * 20,
    vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6 - 1,
    size: Math.random() * 3 + 1, life: 1, maxLife: 20 + Math.random() * 20,
  }));

/* ─── Scramble ─── */
const scrambleChars = '!<>-_\\/[]{}—=+*^?#_';
const scrambleText = (t: string) => t.split('').map(c => c === ' ' ? ' ' : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]).join('');

const tagVariant = {
  hidden: { opacity: 0, scale: 0.3, y: 12 },
  visible: (i: number) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { delay: 0.25 + i * 0.05, type: 'spring' as const, stiffness: 350, damping: 14 },
  }),
};

const WorkCard: React.FC<WorkCardProps> = ({ title, description, tags, featured, imgsrc }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrambleTitle, setScrambleTitle] = useState(title);
  const [particles, setParticles] = useState<Particle[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrambleCount = useRef(0);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sy = useSpring(ry, { stiffness: 200, damping: 18 });

  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const gX = useSpring(glowX, { stiffness: 80, damping: 15 });
  const gY = useSpring(glowY, { stiffness: 80, damping: 15 });

  const imgX = useMotionValue(0);
  const imgY = useMotionValue(0);
  const imgSX = useSpring(imgX, { stiffness: 150, damping: 12 });
  const imgSY = useSpring(imgY, { stiffness: 150, damping: 12 });
  const imgScale = useMotionValue(1.08);

  /* ── Scramble ── */
  const startScramble = useCallback(() => {
    scrambleCount.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      scrambleCount.current++;
      if (scrambleCount.current >= 8) {
        setScrambleTitle(title);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        return;
      }
      setScrambleTitle(scrambleText(title));
    }, 50);
  }, [title]);

  const stopScramble = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setScrambleTitle(title);
  }, [title]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  /* ── Mouse ── */
  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      const tilt = 12;
      rx.set(dx * tilt);
      ry.set(-dy * tilt);
      imgX.set(dx * 12);
      imgY.set(-dy * 12);
      glowX.set(((e.clientX - rect.left) / rect.width) * 100);
      glowY.set(((e.clientY - rect.top) / rect.height) * 100);

      if (isHovered && Math.random() > 0.75) {
        setParticles(prev => [...prev.slice(-35), ...spawnParticles(e.clientX - rect.left, e.clientY - rect.top)]);
      }
    },
    [rx, ry, imgX, imgY, glowX, glowY, isHovered],
  );

  const handleEnter = useCallback(() => {
    setIsHovered(true);
    startScramble();
    imgScale.set(1.15);
  }, [startScramble, imgScale]);

  const handleLeave = useCallback(() => {
    rx.set(0); ry.set(0); imgX.set(0); imgY.set(0); glowX.set(50); glowY.set(50);
    setIsHovered(false);
    stopScramble();
    setParticles([]);
    imgScale.set(1.08);
  }, [rx, ry, imgX, imgY, glowX, glowY, stopScramble, imgScale]);

  useAnimationFrame(() => {
    if (!isHovered && particles.length === 0) return;
    setParticles(prev => prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.06, life: p.life - 1 / p.maxLife })).filter(p => p.life > 0));
  });

  return (
    <motion.div
      ref={cardRef}
      className="glass-card flex flex-col h-full overflow-hidden p-0 relative"
      style={{ rotateX: sy, rotateY: sx, transformPerspective: 1200 }}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
    >
      {/* Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="pointer-events-none absolute rounded-full z-20"
          style={{
            left: p.x, top: p.y, width: p.size, height: p.size,
            background: `hsl(${199 + Math.random() * 30}, 80%, 60%)`,
            opacity: p.life * 0.8,
            boxShadow: `0 0 ${p.size * 3}px hsl(${199 + Math.random() * 30}, 80%, 60% / 0.4)`,
            x: '-50%', y: '-50%',
          }}
        />
      ))}

      {/* Cursor glow overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[1rem] z-10 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at ${gX.get()}% ${gY.get()}%, hsl(var(--ac) / 0.1), transparent 70%)`,
        }}
      />

      {/* Image */}
      <motion.div
        className="relative h-52 overflow-hidden rounded-t-2xl rounded-b-none"
        initial={{ clipPath: 'inset(0 50% 0 50%)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0%)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      >
        <motion.img
          src={imgsrc}
          alt={title}
          className="w-full h-full object-cover"
          style={{ x: imgSX, y: imgSY, scale: imgScale }}
        />

        {/* Image gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-linear-to-t from-background/95 via-background/30 to-transparent"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: isHovered ? 0.8 : 0.5 }}
          transition={{ duration: 0.4 }}
        />

        {/* Animated border accent at image bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent/40"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          style={{ transformOrigin: 'left' }}
        />

        {featured && (
          <motion.span
            className="absolute top-3 left-3 px-3 py-1 rounded-full border border-accent/40 bg-accent/15 text-accent text-[10px] font-black uppercase tracking-wider backdrop-blur-sm z-20"
            whileHover={{ scale: 1.1, backgroundColor: 'hsl(var(--ac) / 0.3)' }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 10 }}
          >
            <motion.span className="flex items-center gap-1.5">
              <motion.span
                className="w-1 h-1 rounded-full bg-accent inline-block"
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const }}
              />
              Featured
            </motion.span>
          </motion.span>
        )}

        {/* Tech count badge */}
        <motion.span
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/60 backdrop-blur-sm border border-accent/15 text-accent/70 text-[9px] font-black tracking-wider z-20"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring' as const, stiffness: 300, damping: 14 }}
        >
          {tags.length} tech
        </motion.span>
      </motion.div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 gap-4 relative z-10">
        <motion.h2
          className="text-xl font-black tracking-tight text-foreground min-h-[1.4em]"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {scrambleTitle}
        </motion.h2>

        <motion.p
          className="text-foreground/60 text-sm leading-relaxed font-light flex-1"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {description}
        </motion.p>

        <div className="flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <motion.span
              key={t}
              className="tag cursor-default"
              variants={tagVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              whileHover={{
                scale: 1.12, backgroundColor: 'hsl(var(--ac) / 0.2)',
                borderColor: 'hsl(var(--ac) / 0.6)', y: -2,
              }}
              transition={{ type: 'spring' as const, stiffness: 400, damping: 10 }}
            >
              {t}
            </motion.span>
          ))}
        </div>

      </div>
    </motion.div>
  );
};

export default WorkCard;
