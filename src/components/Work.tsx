import React, { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import WorkCard from './WorkCard';
import WorkCardData from './WorkCardData';
import { FadeInUp } from './';

interface ProjectData {
  title: string; description: string;
  tags: string[]; featured: boolean; imgsrc: string;
}

const r = (a: number, b: number) => Math.random() * (b - a) + a;

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 60, scale: 0.9, rotateX: 4 },
  visible: {
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const filterLabels = ['All', 'React', 'Full-Stack', 'Node.js'];

const bgShapes = Array.from({ length: 6 }, (_, i) => ({
  id: i, x: r(2, 98), y: r(2, 98), size: r(40, 100), speed: r(0.05, 0.12),
  type: i % 2 === 0 ? 'circle' as const : 'square' as const,
  delay: r(0, 4), duration: r(6, 12),
}));

const Work: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const { scrollYProgress } = useScroll({
    target: sectionRef, offset: ['start end', 'end start'],
  });

  const projects = useMemo(() => {
    const all = WorkCardData as ProjectData[];
    if (activeFilter === 'All') return all;
    return all.filter((p) => {
      const tags = p.tags.map((t) => t.toLowerCase());
      if (activeFilter === 'React') return tags.some((t) => t === 'react' || t === 'next.js');
      if (activeFilter === 'Node.js') return tags.includes('node.js');
      if (activeFilter === 'Full-Stack') return tags.includes('node.js') && tags.some((t) => t === 'react' || t === 'next.js' || t === 'angular');
      return true;
    });
  }, [activeFilter]);

  const titleChars = useMemo(() => 'PROJECTS.'.split(''), []);

  return (
    <section ref={sectionRef} className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
      {/* Decorative bg shapes */}
      {bgShapes.map((s) => {
        const y = useTransform(scrollYProgress, [0, 1], [s.y - 5, s.y + 5 + s.speed * 40]);
        const x = useTransform(scrollYProgress, [0, 1], [s.x - 3, s.x + 3 + s.speed * 20]);
        const rot = useTransform(scrollYProgress, [0, 1], [0, 360 * (s.speed > 0 ? 1 : -1)]);
        return (
          <motion.div
            key={s.id}
            className="absolute pointer-events-none"
            style={{
              left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
              x, y, rotate: rot,
              borderRadius: s.type === 'square' ? '8px' : '50%',
              border: '1px solid hsl(var(--ac) / 0.06)',
              background: 'hsl(var(--ac) / 0.015)',
            }}
          />
        );
      })}

      {/* Header */}
      <FadeInUp>
        <p className="section-label">Production Work</p>
      </FadeInUp>

      <motion.h1
        className="section-title flex flex-wrap"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {titleChars.map((ch, i) => (
          <motion.span
            key={i}
            className={ch === '.' ? 'text-accent' : ''}
            initial={{ opacity: 0, y: -30, rotateZ: -8 }}
            whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.05 + i * 0.045, type: 'spring' as const, stiffness: 200, damping: 14,
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </motion.h1>

      <FadeInUp delay={0.2}>
        <p className="section-desc">
          Production applications spanning enterprise platforms, real-time collaboration, and cloud-native architectures — built end-to-end with modern full-stack engineering.
        </p>
      </FadeInUp>

      {/* Filter bar */}
      <FadeInUp delay={0.25}>
        <div className="flex gap-2 mb-10 flex-wrap relative">
          {filterLabels.map((f) => (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`relative px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-colors duration-300 ${
                activeFilter === f
                  ? 'text-accent'
                  : 'text-foreground/40 hover:text-foreground/70'
              }`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 + filterLabels.indexOf(f) * 0.06, duration: 0.4 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              {activeFilter === f && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-accent/12 border border-accent/30"
                  layoutId="filter-pill"
                  transition={{ type: 'spring' as const, stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">{f}</span>
            </motion.button>
          ))}
        </div>
      </FadeInUp>

      {/* Counter */}
      <motion.div
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
      >
        <motion.div className="h-[1px] flex-1 bg-linear-to-r from-accent/20 to-transparent" />
        <motion.span
          className="text-[10px] font-black text-accent/40 uppercase tracking-[0.3em] tabular-nums"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: 'spring' as const, stiffness: 300, damping: 12 }}
        >
          {projects.length} PROJECTS
        </motion.span>
        <motion.div className="h-[1px] flex-1 bg-linear-to-l from-accent/20 to-transparent" />
      </motion.div>

      {/* Grid */}
      <motion.div
        key={activeFilter}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((val, i) => (
          <motion.div key={`${activeFilter}-${i}`} variants={gridItem}>
            <WorkCard imgsrc={val.imgsrc} title={val.title} description={val.description}
              tags={val.tags} featured={val.featured} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Work;
