import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiAngular, SiNodedotjs, SiExpress, SiMongodb, SiGit } from 'react-icons/si';
import { FiServer, FiTrendingUp, FiEye } from 'react-icons/fi';
import { isTouchDevice } from '../lib/isTouchDevice';

interface TechItem {
  name: string;
  gradient: string;
  icon: React.ReactNode;
  color: string;
  tagline: string;
}

const techItems: TechItem[] = [
  { name: 'React.js', gradient: 'from-cyan-400 to-blue-500', icon: <SiReact />, color: '#61dafb', tagline: 'UI library' },
  { name: 'Next.js', gradient: 'from-slate-400 to-slate-700', icon: <SiNextdotjs />, color: '#ffffff', tagline: 'React framework' },
  { name: 'TypeScript', gradient: 'from-blue-500 to-indigo-500', icon: <SiTypescript />, color: '#3178c6', tagline: 'Typed JavaScript' },
  { name: 'Node.js', gradient: 'from-green-400 to-emerald-500', icon: <SiNodedotjs />, color: '#339933', tagline: 'JavaScript runtime' },
  { name: 'Express.js', gradient: 'from-zinc-500 to-slate-700', icon: <SiExpress />, color: '#ffffff', tagline: 'Web framework' },
  { name: 'Angular', gradient: 'from-red-500 to-rose-600', icon: <SiAngular />, color: '#dd0031', tagline: 'Web framework' },
  { name: 'MongoDB', gradient: 'from-green-500 to-lime-500', icon: <SiMongodb />, color: '#47A248', tagline: 'NoSQL database' },
  { name: 'MSSQL', gradient: 'from-red-500 to-orange-500', icon: <FiServer />, color: '#cc2927', tagline: 'Relational database' },
  { name: 'PostgreSQL', gradient: 'from-blue-500 to-indigo-600', icon: <SiMongodb />, color: '#336791', tagline: 'Relational DB' },
  { name: 'Sequelize', gradient: 'from-cyan-500 to-teal-500', icon: <SiExpress />, color: '#52b0e7', tagline: 'ORM for SQL' },
  { name: 'Prisma', gradient: 'from-slate-600 to-slate-800', icon: <SiExpress />, color: '#2d3748', tagline: 'Next-gen ORM' },
  { name: 'Mongoose', gradient: 'from-green-600 to-emerald-700', icon: <SiMongodb />, color: '#880000', tagline: 'MongoDB ODM' },
  { name: 'AWS', gradient: 'from-orange-400 to-yellow-500', icon: <FiServer />, color: '#ff9900', tagline: 'Cloud platform' },
  { name: 'Azure', gradient: 'from-blue-400 to-indigo-500', icon: <FiServer />, color: '#0078d4', tagline: 'Cloud platform' },
  { name: 'REST APIs', gradient: 'from-sky-400 to-cyan-500', icon: <FiServer />, color: '#0ea5e9', tagline: 'API architecture' },
  { name: 'Socket.IO', gradient: 'from-slate-400 to-slate-700', icon: <FiServer />, color: '#010101', tagline: 'Real-time engine' },
  { name: 'Git', gradient: 'from-orange-500 to-red-500', icon: <SiGit />, color: '#f05032', tagline: 'Version control' },
  { name: 'CI/CD', gradient: 'from-green-400 to-emerald-500', icon: <FiTrendingUp />, color: '#22c55e', tagline: 'Pipeline automation' },
];

const row1: TechItem[] = techItems.slice(0, 9);
const row2: TechItem[] = techItems.slice(9);

const glitchChars = '!<>-_\\/[]{}—=+*^?#'.split('');

function useScramble(finalText: string) {
  const [text, setText] = useState(finalText);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    let iter = 0;
    intervalRef.current = setInterval(() => {
      setText(finalText.split('').map((char, i) => {
        if (i < iter) return char;
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }).join(''));
      if (iter >= finalText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setText(finalText);
      }
      iter += 1 / 3;
    }, 40);
  }, [finalText]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setText(finalText);
  }, [finalText]);

  return { text, start, stop };
}

interface PopupData {
  item: TechItem;
  x: number;
  y: number;
}

const PopupParticle: React.FC<{ color: string }> = ({ color }) => {
  const angle = Math.random() * Math.PI * 2;
  const dist = 20 + Math.random() * 40;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 2 + Math.random() * 4,
        height: 2 + Math.random() * 4,
        background: color,
        boxShadow: `0 0 6px ${color}`,
        left: '50%', top: '50%',
      }}
      initial={{ x: 0, y: 0, opacity: 1 }}
      animate={{
        x: [0, Math.cos(angle) * dist, Math.cos(angle) * dist * 2],
        y: [0, Math.sin(angle) * dist, Math.sin(angle) * dist * 2],
        opacity: [1, 0.8, 0],
        scale: [1, 0.5, 0],
      }}
      transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: 'easeOut' as const, delay: Math.random() * 0.5 }}
    />
  );
};

const TechPopup: React.FC<{ data: PopupData; onClose: () => void }> = ({ data, onClose }) => {
  const { item, x, y } = data;
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - r.left) / r.width - 0.5) * 8,
      y: ((e.clientY - r.top) / r.height - 0.5) * 8,
    });
  };

  return (
    <motion.div
      className="fixed z-[60] pointer-events-auto"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.3, y: 12, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.3, y: 8, filter: 'blur(10px)' }}
      transition={{ type: 'spring' as const, stiffness: 350, damping: 22, filter: { type: 'tween' as const, duration: 0.3 } }}
      onMouseMove={onMove}
      onMouseLeave={onClose}
    >
      {/* Center wrapper */}
      <div style={{ transform: 'translateX(-50%)' }}>
        {/* Arrow pointing to the text */}
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-3 h-3 -translate-x-1/2 rotate-45 pointer-events-none z-10"
          style={{
            background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
            border: `1px solid ${item.color}40`,
            borderColor: `${item.color}40 transparent transparent ${item.color}40`,
          }}
        />

        <motion.div
          className="relative rounded-2xl p-5 min-w-[200px] overflow-hidden"
          style={{
            x: mouse.x,
            y: mouse.y,
            background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
            border: `1px solid ${item.color}40`,
            boxShadow: `0 0 60px ${item.color}40, 0 20px 60px rgba(0,0,0,0.4)`,
            backdropFilter: 'blur(24px)',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => <PopupParticle key={i} color={item.color} />)}

          <motion.div
            className="absolute left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)` }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' as const }}
          />

          <motion.div
            className="text-6xl mb-3 flex justify-center"
            style={{ color: item.color }}
            animate={{ y: [0, -5, 0], filter: ['drop-shadow(0 0 8px transparent)', `drop-shadow(0 0 24px ${item.color}80)`, 'drop-shadow(0 0 8px transparent)'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const }}
          >
            {item.icon}
          </motion.div>

          <p className="text-center text-xl font-black text-foreground tracking-tight mb-0.5">{item.name}</p>
          <p className="text-center text-sm font-medium text-foreground/50">{item.tagline}</p>

          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full pointer-events-none" style={{ background: `${item.color}25`, filter: 'blur(24px)' }} />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full pointer-events-none" style={{ background: `${item.color}15`, filter: 'blur(24px)' }} />
        </motion.div>
      </div>
    </motion.div>
  );
};

const clickKeyframes = {
  rotateY: [0, 360],
  scale: [1, 1.5, 0.8, 1.2, 1],
  filter: [
    'brightness(1) drop-shadow(0 0 0px transparent)',
    'brightness(2) drop-shadow(0 0 40px hsl(var(--ac) / 0.8))',
    'brightness(0.3) drop-shadow(0 0 0px transparent)',
    'brightness(1.5) drop-shadow(0 0 20px hsl(var(--ac) / 0.4))',
    'brightness(1) drop-shadow(0 0 0px transparent)',
  ],
};
const clickTransition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };

const Item: React.FC<{ item: TechItem; onHover: (e: React.MouseEvent, item: TechItem) => void; onClick_: (e: React.MouseEvent, item: TechItem) => void }> = ({ item, onHover, onClick_ }) => {
  const { text, start, stop } = useScramble(item.name);
  const controls = useAnimation();
  const [bursting, setBursting] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    if (bursting) return;
    setBursting(true);
    onClick_(e, item);
    await controls.start(clickKeyframes, clickTransition);
    setBursting(false);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    start();
    onHover(e, item);
  };

  const handleMouseLeave = () => {
    stop();
  };

  return (
    <motion.span
      className={`relative inline-block bg-linear-to-r ${item.gradient} bg-clip-text text-transparent select-none whitespace-nowrap
        text-[clamp(1.8rem,4vw,3.2rem)] font-black tracking-tight cursor-pointer`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={controls}
      whileHover={{
        scale: 1.35,
        y: -6,
        filter: 'brightness(1.3) drop-shadow(0 0 24px hsl(var(--ac) / 0.6))',
        transition: { type: 'spring' as const, stiffness: 300, damping: 15 },
      }}
    >
      {bursting ? item.name : text}
    </motion.span>
  );
};

const MarqueeRow: React.FC<{ items: TechItem[]; duration: number; reversed?: boolean; paused: boolean; onHover: (e: React.MouseEvent, item: TechItem) => void; onClick_: (e: React.MouseEvent, item: TechItem) => void }> = ({ items, duration, reversed, paused, onHover, onClick_ }) => {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden w-full">
      <motion.div
        className={`flex gap-12 md:gap-20 flex-shrink-0 pr-12 md:pr-20 animate-marquee-${reversed ? 'right' : 'left'}`}
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {doubled.map((item, i) => (
          <Item key={i} item={item} onHover={onHover} onClick_={onClick_} />
        ))}
      </motion.div>
    </div>
  );
};

const burstColors = [
  '#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#34d399', '#fbbf24', '#fb923c', '#f87171',
];

const TechMarquee: React.FC = () => {
  const [paused, setPaused] = useState(false);
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [particles, setParticles] = useState<any[]>([]);
  const idRef = useRef(0);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const popupPos = useRef({ x: 0, y: 0 });
  const onItemHover = useCallback((e: React.MouseEvent, item: TechItem) => {
    if (isTouchDevice) return;
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    popupPos.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.88,
    };
    setPopup({ item, x: popupPos.current.x, y: popupPos.current.y });
  }, []);

  const onItemLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => setPopup(null), 100);
  }, []);

  const onPopupClose = useCallback(() => {
    setPopup(null);
  }, []);

  const onClickItem = useCallback((e: React.MouseEvent, item: TechItem) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const newParticles = Array.from({ length: 14 }, (_, i) => ({
      id: ++idRef.current,
      x: cx,
      y: cy,
      angle: (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.6,
      color: burstColors[i % burstColors.length],
      label: i < 5 ? item.name[i] || item.name : '',
    }));
    setParticles(prev => [...prev.slice(-40), ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1200);
  }, []);

  return (
    <section
      className="py-16 md:py-24 overflow-x-hidden relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setPopup(null); }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsl(var(--ac) / 0.04) 0%, transparent 70%)',
        }}
      />

      <div className="flex flex-col gap-8 md:gap-10" onMouseLeave={onItemLeave}>
        <MarqueeRow items={row1} duration={24} paused={paused} onHover={onItemHover} onClick_={onClickItem} />
        <MarqueeRow items={row2} duration={28} reversed paused={paused} onHover={onItemHover} onClick_={onClickItem} />
      </div>

      {/* Tech popup */}
      <AnimatePresence>
        {popup && <TechPopup key={popup.item.name} data={popup} onClose={onPopupClose} />}
      </AnimatePresence>

      {/* Click particle bursts */}
      <AnimatePresence>
        {particles.map(p => (
          <React.Fragment key={p.id}>
            <motion.div
              className="fixed pointer-events-none z-50 rounded-full"
              style={{ x: p.x - 4, y: p.y - 4, width: 8, height: 8, background: p.color, boxShadow: `0 0 12px ${p.color}` }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                x: p.x + Math.cos(p.angle) * 70,
                y: p.y + Math.sin(p.angle) * 70,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' as const }}
            />
            {p.label && (
              <motion.span
                className="fixed pointer-events-none z-50 text-xs font-black text-foreground/60"
                style={{ x: p.x - 6, y: p.y - 6 }}
                initial={{ opacity: 1, y: p.y }}
                animate={{
                  x: p.x + Math.cos(p.angle) * 50,
                  y: p.y + Math.sin(p.angle) * 50,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' as const, delay: 0.05 }}
              >
                {p.label}
              </motion.span>
            )}
          </React.Fragment>
        ))}
      </AnimatePresence>

      {/* Edge fade masks */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-linear-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-linear-to-l from-background to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default TechMarquee;
