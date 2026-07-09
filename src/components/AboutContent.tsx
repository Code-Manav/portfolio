import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { FadeInUp, SkillBar } from './';

const skills = [
  { name: 'React.js', level: 95 },
  { name: 'Node.js', level: 92 },
  { name: 'Next.js', level: 88 },
  { name: 'Express.js', level: 88 },
  { name: 'REST APIs', level: 92 },
  { name: 'TypeScript', level: 85 },
  { name: 'MongoDB', level: 85 },
  { name: 'MSSQL / PostgreSQL', level: 82 },
  { name: 'AWS / Azure', level: 82 },
  { name: 'Database Design', level: 85 },
];

const letterVariants = {
  hidden: { opacity: 0, y: 30, rotateZ: -5 },
  visible: (i: number) => ({
    opacity: 1, y: 0, rotateZ: 0,
    transition: { delay: 0.15 + i * 0.035, type: 'spring' as const, stiffness: 180, damping: 15 },
  }),
};

const wordVariants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(4px)' as const },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: 0.3 + i * 0.025, duration: 0.4, ease: 'easeOut' as const },
  }),
};

const bio1 = "I'm a Senior Full-Stack Software Engineer with 4.5+ years of experience building production-ready web applications. I specialize in React and Next.js on the frontend with Node.js and Express powering the backend — architecting everything from database schemas and REST APIs to cloud deployments on AWS and Azure.".split(' ');
const bio2 = "I focus on writing clean, maintainable code and solving real business problems through technology. Whether it's designing authentication systems with JWT and RBAC, optimizing complex Sequelize queries, integrating third-party services like Twilio and SendGrid, or debugging production issues — I've delivered across the full stack in Agile environments.".split(' ');
const bio3 = "I believe great software is built at the intersection of scalable architecture and intuitive user experience. I've mentored developers, championed code reviews, and continuously push to adopt modern practices that improve both team velocity and product quality.".split(' ');

/* ─── CountUp ─── */
const CountUp: React.FC<{ to: number; suffix?: string; delay?: number }> = ({ to, suffix = '', delay = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      const timer = setTimeout(() => {
        const steps = 40;
        const increment = to / steps;
        let current = 0;
        const interval = setInterval(() => {
          current += increment;
          if (current >= to) {
            setCount(to);
            clearInterval(interval);
          } else {
            setCount(Math.floor(current));
          }
        }, 20);
        return () => clearInterval(interval);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [inView, to, delay]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ─── TiltCard for stat cards ─── */
const TiltStat: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay: number;
}> = ({ children, className = '', delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20 });
  const sy = useSpring(y, { stiffness: 250, damping: 20 });

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(dx * 8);
      y.set(-dy * 8);
    },
    [x, y],
  );
  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: sy, rotateY: sx, transformPerspective: 800 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' as const }}
    >
      {children}
    </motion.div>
  );
};

const AboutContent: React.FC = () => (
  <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* Left */}
      <div>
        <FadeInUp>
          <p className="section-label">How I Build Software</p>
        </FadeInUp>

        {/* WHO AM I? letter stagger */}
        <motion.h1
          className="section-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {'WHO AM I?'.split('').map((ch, i) => (
            <motion.span
              key={i}
              className={`inline-block ${ch === '?' ? 'text-accent' : ''}`}
              variants={letterVariants}
              custom={i}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
        </motion.h1>

        {/* Bio 1 word reveal */}
        <motion.p
          className="text-foreground/65 text-lg leading-relaxed font-light mb-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {bio1.map((word, i) => (
            <React.Fragment key={i}>
              <motion.span
                className="inline-block"
                variants={wordVariants}
                custom={i}
              >
                {word}
              </motion.span>
              {i < bio1.length - 1 && '\u00A0'}
            </React.Fragment>
          ))}
        </motion.p>

        {/* Bio 2 word reveal */}
        <motion.p
          className="text-foreground/65 text-lg leading-relaxed font-light mb-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {bio2.map((word, i) => (
            <React.Fragment key={i}>
              <motion.span
                className="inline-block"
                variants={wordVariants}
                custom={i + bio1.length}
              >
                {word}
              </motion.span>
              {i < bio2.length - 1 && '\u00A0'}
            </React.Fragment>
          ))}
        </motion.p>

        {/* Bio 3 word reveal */}
        <motion.p
          className="text-foreground/65 text-lg leading-relaxed font-light mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {bio3.map((word, i) => (
            <React.Fragment key={i}>
              <motion.span
                className="inline-block"
                variants={wordVariants}
                custom={i + bio1.length + bio2.length}
              >
                {word}
              </motion.span>
              {i < bio3.length - 1 && '\u00A0'}
            </React.Fragment>
          ))}
        </motion.p>

        {/* Skill Bars */}
        <FadeInUp delay={0.4} className="mb-10">
          <motion.h3
            className="text-sm font-black text-accent uppercase tracking-widest mb-6"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Technical Skills
          </motion.h3>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <SkillBar key={skill.name} skill={skill.name} level={skill.level} delay={0.5 + index * 0.1} />
            ))}
          </div>
        </FadeInUp>

        <FadeInUp delay={1.2}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 15 }}
          >
            <Link to="/contact" className="btn btn-primary inline-block">Start a Conversation</Link>
          </motion.div>
        </FadeInUp>
      </div>

      {/* Right — stat cards */}
      <div className="flex justify-center lg:justify-end">
        <div className="relative w-72 h-96">
          {/* Main card */}
          <TiltStat delay={0.3} className="absolute inset-0">
            <div className="glass-card w-full h-full flex flex-col items-center justify-center rounded-3xl overflow-hidden">
              <motion.div
                className="w-full h-full bg-linear-to-br from-accent/25 to-background"
                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' as const }}
                style={{ backgroundSize: '200% 200%' }}
              />
              {/* Decorative dots */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'radial-gradient(circle, hsl(var(--ac)) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
            </div>
          </TiltStat>

          {/* Exp stat */}
          <TiltStat delay={0.5} className="absolute -bottom-6 -left-6 w-40 h-32 z-10">
            <div className="glass-card w-full h-full flex flex-col justify-center">
              <motion.p
                className="text-4xl font-black text-accent leading-none"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: 'spring' as const, stiffness: 300, damping: 12 }}
              >
                <CountUp to={4} suffix=".5+" delay={0.65} />
              </motion.p>
              <p className="text-sm text-muted font-semibold mt-1">Years Experience</p>
            </div>
          </TiltStat>

          {/* Projects stat */}
          <TiltStat delay={0.7} className="absolute -top-4 -right-4 w-36 h-24 z-10">
            <div className="glass-card w-full h-full flex flex-col justify-center">
              <motion.p
                className="text-3xl font-black text-accent leading-none"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: 'spring' as const, stiffness: 300, damping: 12 }}
              >
                <CountUp to={6} suffix="+" delay={0.85} />
              </motion.p>
              <p className="text-xs text-muted font-semibold mt-1">Projects Shipped</p>
            </div>
          </TiltStat>

          {/* Floating glow */}
          <motion.div
            className="absolute -top-10 -right-10 w-48 h-48 bg-accent/15 rounded-full blur-3xl pointer-events-none"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut' as const,
            }}
          />
        </div>
      </div>
    </div>
  </section>
);

export default AboutContent;
