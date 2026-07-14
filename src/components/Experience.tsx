import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useAnimationFrame,
  type MotionValue,
} from 'framer-motion';
import { FadeInUp } from './';
import { isTouchDevice } from '../lib/isTouchDevice';

/* ─── Text scramble helper ─── */
const chars = '!<>-_\\/[]{}—=+*^?#________';

const scrambleText = (target: string): string =>
  target
    .split('')
    .map((ch) => (ch === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]))
    .join('');

/* ─── Particle helpers ─── */
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  hue: number;
}
let pid = 0;
const spawnParticles = (cx: number, cy: number, count: number): Particle[] =>
  Array.from({ length: count }, () => ({
    id: pid++,
    x: cx + (Math.random() - 0.5) * 40,
    y: cy + (Math.random() - 0.5) * 40,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 8 - 2,
    size: Math.random() * 5 + 2,
    life: 1,
    maxLife: Math.random() * 40 + 30,
    hue: 199 + Math.random() * 40,
  }));

interface Job { company: string; role: string; duration: string; location: string; points: string[]; tags?: string[]; }
const jobs: Job[] = [
  {
    company: "Avdevs Solutions",
    role: "Senior Full-Stack Engineer",
    duration: "2023 – Present",
    location: "Vadodara, Gujarat",
    tags: ["React", "Next.js", "Azure", "AWS", "MSSQL", "Sequelize", "CI/CD", "Enterprise systems"],
    points: [
      "Architected and built enterprise-grade applications with React admin dashboards, customer portals, and kiosk interfaces backed by Node.js and Express REST APIs deployed on Azure.",
      "Designed authentication and authorization systems including JWT access/refresh token flows, OTP verification via Twilio, role-based access control (RBAC), and secure password reset workflows.",
      "Built and optimized REST APIs with MSSQL and Sequelize — implementing complex queries, database transactions, pagination, indexing, and performance tuning for production workloads.",
      "Integrated third-party services including SendGrid for transactional email templates, Twilio for SMS notifications, Stripe for payment processing, and webhook handlers for event-driven workflows.",
      "Developed PDF generation pipelines, file upload services, and email notification systems for automated onboarding and reporting workflows.",
      "Implemented CI/CD pipelines on Azure, managed production deployments, and resolved live-site issues including authentication bugs, token refresh failures, and API performance bottlenecks.",
      "Followed service-oriented architecture with clean separation of business logic, middleware for request validation and error handling, API versioning, and structured logging for observability."
    ]
  },
  {
    company: "InnovateMR",
    role: "MEAN Stack Engineer",
    duration: "2021 – 2023",
    location: "Vadodara, Gujarat",
    tags: ["Angular", "Node.js", "Express", "MongoDB", "Authentication", "APIs"],
    points: [
      "Developed full-stack enterprise applications across the complete MEAN stack — MongoDB, Express.js, Angular, and Node.js — from database schema design and REST API development to dynamic frontend implementation.",
      "Built responsive and dynamic user interfaces using Angular with reusable component architecture, services, dependency injection, reactive forms, and scalable frontend patterns.",
      "Designed and implemented RESTful APIs using Node.js and Express.js, leveraging Express middleware architecture for request validation, error handling, and secure API communication.",
      "Architected MongoDB collections and optimized database queries using Mongoose ODM for schema modeling, validations, indexes, and efficient data retrieval in production workloads.",
      "Implemented JWT-based authentication and role-based access control (RBAC) for secure user authorization and protected API endpoints.",
      "Developed CRUD modules for business workflows and administrative operations, and integrated third-party APIs and external services into backend applications.",
      "Participated in debugging, troubleshooting, and resolving production issues while collaborating with cross-functional teams in an Agile development environment using Git for feature-based version control."
    ]
  }
];

/* ─── Utils ─── */
const titleChars = 'EXPERIENCE.'.split('');
const r = (a: number, b: number) => Math.random() * (b - a) + a;

/* ─── Floating particles (rendered once, driven by CSS) ─── */
const backdropParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: r(5, 95),
  y: r(5, 95),
  size: r(3, 8),
  delay: r(0, 5),
  duration: r(6, 14),
}));

/* ─── Variants ─── */
const dotPulse = {
  initial: { boxShadow: '0 0 0px hsl(var(--ac) / 0.4)' },
  pulse: {
    boxShadow: [
      '0 0 0px hsl(var(--ac) / 0.4)',
      '0 0 22px hsl(var(--ac) / 0.7)',
      '0 0 0px hsl(var(--ac) / 0.4)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

const cardEnter = (i: number) => ({
  hidden: { opacity: 0, y: 60, rotateX: 6, scale: 0.94 },
  visible: {
    opacity: 1, y: 0, rotateX: 0, scale: 1,
    transition: {
      delay: 0.2 + i * 0.18,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
});

const stepNumVariant = {
  hidden: { opacity: 0, scale: 0.2, y: 20 },
  visible: (d: number) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { delay: d, type: 'spring' as const, stiffness: 250, damping: 14 },
  }),
};

const durationBadgeVariant = {
  hidden: { opacity: 0, scale: 0.3, rotate: -15, x: 20 },
  visible: (d: number) => ({
    opacity: 1, scale: 1, rotate: 0, x: 0,
    transition: { delay: d, type: 'spring' as const, stiffness: 200, damping: 16 },
  }),
};

const tagVariant = {
  hidden: { opacity: 0, scale: 0.3, y: 12 },
  visible: (i: number) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { delay: 0.35 + i * 0.05, type: 'spring' as const, stiffness: 350, damping: 14 },
  }),
};

const bulletVariant = {
  hidden: { opacity: 0, x: -24, filter: 'blur(4px)' as const },
  visible: (d: number) => ({
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { delay: d, duration: 0.5, ease: 'easeOut' as const },
  }),
};

/* ─── 3D Card Tilt + Scramble + Particles ─── */
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  i: number;
  roleText: string;
}> = ({ children, className = '', i, roleText }) => {
  const ref = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState(roleText);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdx = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrambleCount = useRef(0);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(rawY, { stiffness: 300, damping: 30 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  /* ── Text Scramble ── */
  const startScramble = useCallback(() => {
    scrambleCount.current = 0;
    const totalIterations = 8;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      scrambleCount.current++;
      if (scrambleCount.current >= totalIterations) {
        setDisplayText(roleText);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        return;
      }
      setDisplayText(scrambleText(roleText));
    }, 60);
  }, [roleText]);

  const stopScramble = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayText(roleText);
  }, [roleText]);

  /* ── Mouse ── */
  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      rawY.set(-dy * 10);
      rawX.set(dx * 10);
      glowX.set(((e.clientX - rect.left) / rect.width) * 100);
      glowY.set(((e.clientY - rect.top) / rect.height) * 100);

      /* Spawn particles */
      if (isHovered && Math.random() > 0.7) {
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const newP = spawnParticles(px, py, 2);
        setParticles((prev) => [...prev.slice(-30), ...newP]);
      }
    },
    [rawX, rawY, glowX, glowY, isHovered],
  );

  const handleEnter = useCallback(() => {
    if (isTouchDevice) return;
    setIsHovered(true);
    startScramble();
  }, [startScramble]);

  const handleLeave = useCallback(() => {
    if (isTouchDevice) return;
    rawX.set(0);
    rawY.set(0);
    glowX.set(50);
    glowY.set(50);
    setIsHovered(false);
    stopScramble();
    setParticles([]);
  }, [rawX, rawY, glowX, glowY, stopScramble]);

  /* ── Particle animation loop ── */
  useAnimationFrame(() => {
    if (!isHovered && particles.length === 0) return;
    setParticles((prev) =>
      prev
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.08,
          life: p.life - 1 / p.maxLife,
        }))
        .filter((p) => p.life > 0),
    );
  });

  /* cleanup */
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      variants={cardEnter(i)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {children}

      {/* 3D spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[1rem] opacity-0 transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, hsl(var(--ac) / 0.15), transparent 70%)`
            : 'transparent',
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: `hsl(${p.hue}, 80%, 60%)`,
            opacity: p.life,
            boxShadow: `0 0 ${p.size * 2}px hsl(${p.hue}, 80%, 60% / 0.5)`,
            x: '-50%',
            y: '-50%',
          }}
        />
      ))}
    </motion.div>
  );
};

/* ─── Scroll-driven progress orb ─── */
const ScrollProgressOrb: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const y = useTransform(progress, [0, 1], ['-2%', '98%']);
  const scale = useTransform(progress, [0, 0.15, 0.85, 1], [0.3, 1, 1, 0.3]);
  const opacity = useTransform(progress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute -left-[7px] w-[16px] h-[16px] z-20"
      style={{ top: 0, y, scale, opacity }}
    >
      <motion.div
        className="w-full h-full rounded-full bg-accent"
        style={{
          boxShadow: '0 0 20px hsl(var(--ac) / 0.6), 0 0 60px hsl(var(--ac) / 0.25)',
        }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
      />
    </motion.div>
  );
};

/* ─── Decorative floating parallax shapes ─── */
const FloatingShapes: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const shapes = [
    { t: 'circle', size: 60, x: 5, y: 20, speed: 0.08 },
    { t: 'circle', size: 30, x: 92, y: 40, speed: -0.12 },
    { t: 'square', size: 40, x: 10, y: 70, speed: 0.1 },
    { t: 'circle', size: 20, x: 88, y: 15, speed: -0.06 },
    { t: 'square', size: 24, x: 50, y: 85, speed: 0.14 },
    { t: 'circle', size: 14, x: 75, y: 60, speed: -0.09 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((s, i) => {
        const y = useTransform(progress, [0, 1], [s.y - 8, s.y + 8 + s.speed * 60]);
        const x = useTransform(progress, [0, 1], [s.x - 2, s.x + 2 + s.speed * 20]);
        const rot = useTransform(progress, [0, 1], [0, 360 * (s.speed > 0 ? 1 : -1)]);

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.t === 'square' ? s.size : s.size,
              x,
              y,
              rotate: rot,
              borderRadius: s.t === 'square' ? '6px' : '50%',
              border: '1px solid hsl(var(--ac) / 0.15)',
              background: 'hsl(var(--ac) / 0.03)',
              backdropFilter: 'blur(2px)',
            }}
          />
        );
      })}
    </div>
  );
};

/* ─── Magnetic Dot ─── */
const MagneticDot: React.FC<{ i: number }> = ({ i }) => {
  const dotRef = useRef<HTMLDivElement>(null);
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const sX = useSpring(mX, { stiffness: 150, damping: 12 });
  const sY = useSpring(mY, { stiffness: 150, damping: 12 });
  const [ripples, setRipples] = useState<{ id: number; scale: number }[]>([]);
  const rid = useRef(0);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice || !dotRef.current) return;
      const rect = dotRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 120;
      if (dist < radius) {
        const strength = (1 - dist / radius) * 14;
        mX.set((dx / dist || 0) * strength);
        mY.set((dy / dist || 0) * strength);
      } else {
        mX.set(0);
        mY.set(0);
      }
    },
    [mX, mY],
  );

  const handleEnter = useCallback(() => {
    if (isTouchDevice) return;
    const id = rid.current++;
    setRipples((prev) => [...prev, { id, scale: 1 }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1200);
  }, []);

  const handleLeave = useCallback(() => {
    if (isTouchDevice) return;
    mX.set(0);
    mY.set(0);
  }, [mX, mY]);

  return (
    <div
      className="absolute -left-[2.65rem] top-2 z-10"
      style={{ width: 16, height: 16 }}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Ripple rings */}
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          className="absolute inset-0 rounded-full border border-accent/50"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 6, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' as const }}
        />
      ))}

      {/* Core dot */}
      <motion.div
        ref={dotRef}
        className="w-full h-full rounded-full bg-accent relative"
        style={{ x: sX, y: sY }}
        variants={dotPulse}
        initial="initial"
        animate="pulse"
        whileHover={{ scale: 2, boxShadow: '0 0 40px hsl(var(--ac) / 0.8)' }}
        transition={{ duration: 0.4, type: 'spring' as const, stiffness: 300 }}
      >
        {/* Inner glow dot */}
        <motion.div
          className="absolute inset-1 rounded-full bg-accent/80"
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
        />
      </motion.div>
    </div>
  );
};

/* ─── Animated Step Counter ─── */
const StepCounter: React.FC<{ target: number; delay: number }> = ({ target, delay }) => {
  const [count, setCount] = useState(0);
  const displayed = String(count).padStart(2, '0');

  useEffect(() => {
    const timer = setTimeout(() => {
      const steps = 20;
      let current = 0;
      const interval = setInterval(() => {
        current++;
        const progress = current / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (current >= steps) {
          clearInterval(interval);
          setCount(target);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [target, delay]);

  return (
    <motion.span
      className="absolute -left-[4rem] top-[3px] text-[10px] font-black text-accent/25 select-none tabular-nums"
      initial={{ opacity: 0, scale: 0.2, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring' as const, stiffness: 250, damping: 14 }}
    >
      {displayed}
    </motion.span>
  );
};

/* ─── Job Card (with per-card hooks) ─── */
const JobCard: React.FC<{ job: Job; i: number; progress: MotionValue<number> }> = ({
  job,
  i,
  progress,
}) => {
  const yOff = useTransform(progress, [0, 1], [24 - i * 8, -16 + i * 8]);
  const bgParallax = useTransform(progress, [0, 1], [0, -12 + i * 6]);

  return (
    <div className="relative group">
      <StepCounter target={i + 1} delay={0.25 + i * 0.18} />
      <MagneticDot i={i} />
      <TiltCard className="relative" i={i} roleText={job.role}>
        <motion.div
          className="glass-card relative overflow-hidden"
          style={{ y: yOff }}
        >
          {/* Layer-parallax bg mesh */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              y: bgParallax,
              backgroundImage:
                'radial-gradient(circle at 30% 40%, hsl(var(--ac)), transparent 60%), radial-gradient(circle at 70% 60%, hsl(var(--ac)), transparent 50%)',
            }}
          />

          {/* Shimmer sweep on hover */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-accent/6 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.7, ease: 'easeInOut' as const }}
          />

          {/* Glass highlight */}
          <motion.div
            className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-white/20 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.18, duration: 0.6 }}
          />

          <div className="flex flex-wrap gap-4 justify-between items-start mb-5 relative z-10">
            <div>
              <h3 className="text-xl font-black text-foreground group-hover:text-accent transition-colors duration-500 min-h-[1.4em] flex flex-wrap gap-x-[0.25em]">
                {job.role.split(' ').map((word, wi) => (
                  <motion.span
                    key={wi}
                    className="inline-block"
                    initial={{ opacity: 0, y: 18, rotateZ: 3 }}
                    whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.2 + i * 0.18 + wi * 0.06,
                      type: 'spring' as const,
                      stiffness: 180,
                      damping: 16,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h3>
              <motion.p
                className="text-xs font-bold text-accent/80 uppercase tracking-wider mt-1"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.18, duration: 0.4, ease: 'easeOut' as const }}
              >
                {job.company} · {job.location}
              </motion.p>
            </div>
            <motion.span
              className="px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-[11px] font-black uppercase tracking-wider whitespace-nowrap relative overflow-hidden"
              variants={durationBadgeVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.45 + i * 0.18}
            >
              {job.duration}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-accent/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' as const }}
              />
            </motion.span>
          </div>

          {job.tags && (
            <div className="flex flex-wrap gap-2 mb-4 relative z-10">
              {job.tags.map((t, i) => (
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
          )}

          <ul className="flex flex-col gap-3 relative z-10">
            {job.points.map((p, idx) => (
              <motion.li
                key={idx}
                className="flex items-start gap-3 text-foreground/65 text-sm leading-relaxed font-light"
                variants={bulletVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.45 + i * 0.18 + idx * 0.09}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0 relative"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.5 + i * 0.18 + idx * 0.09,
                    type: 'spring' as const,
                    stiffness: 500,
                    damping: 18,
                  }}
                >
                  <motion.span
                    className="absolute inset-0 rounded-full bg-accent"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.8, delay: idx * 0.2, repeat: Infinity, ease: 'easeOut' as const }}
                  />
                </motion.span>
                {p}
              </motion.li>
            ))}
          </ul>

          {/* Bottom glass sheen */}
          <motion.div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-accent/20 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.18, duration: 0.6 }}
          />
        </motion.div>
      </TiltCard>
    </div>
  );
};

/* ─── Main component ─── */
const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const lineScale = useTransform(scrollYProgress, [0, 0.4, 0.7], [0, 0.6, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Backdrop particles */}
      {backdropParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'hsl(var(--ac) / 0.06)',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut' as const,
          }}
        />
      ))}

      {/* Decorative floating parallax shapes */}
      <FloatingShapes progress={scrollYProgress} />

      {/* Header group */}
      <motion.div style={{ y: headerY, opacity: headerOpacity }} className="relative z-10">
        <div className="relative inline-block">
          <FadeInUp>
            <p className="section-label">Professional Journey</p>
          </FadeInUp>
          <motion.div
            className="absolute -bottom-0.5 left-0 h-[2px] bg-accent/40 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' as const }}
            style={{ width: '100%' }}
          />
        </div>

        <motion.h1 className="section-title flex flex-wrap">
          {titleChars.map((ch, idx) => (
            <motion.span
              key={idx}
              className={ch === '.' ? 'text-accent' : ''}
              initial={{ opacity: 0, y: -40, rotateZ: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.05 + idx * 0.04,
                type: 'spring' as const,
                stiffness: 200,
                damping: 14,
              }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
        </motion.h1>
        <FadeInUp delay={0.25}>
          <p className="section-desc">
            A timeline of my professional journey building enterprise software and scalable solutions.
          </p>
        </FadeInUp>
      </motion.div>

      {/* Timeline */}
      <div className="relative ml-4 pl-8 flex flex-col gap-10 mt-12 z-10">
        <motion.div
          className="absolute left-0 top-0 w-[2px] bg-linear-to-b from-accent via-accent/50 to-transparent rounded-full origin-top"
          style={{ scaleY: lineScale, opacity: lineOpacity, height: '100%' }}
        />

        <ScrollProgressOrb progress={scrollYProgress} />

        {jobs.map((job, i) => (
          <JobCard key={i} job={job} i={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
};

export default Experience;
