import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { isTouchDevice } from '../lib/isTouchDevice';

const glitchChars = '!<>-_\\/[]{}—=+*^?#________'.split('');

interface Shape {
  id: number;
  type: 'circle' | 'triangle' | 'square';
  size: number;
  x: number;
  y: number;
  rotation: number;
  driftX: number;
  driftY: number;
  rotateSpeed: number;
  color: string;
  delay: number;
}

const shapes: Shape[] = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  type: (['circle', 'triangle', 'square'] as const)[i % 3],
  size: 20 + Math.random() * 60,
  x: Math.random() * 100,
  y: Math.random() * 100,
  rotation: Math.random() * 360,
  driftX: (Math.random() - 0.5) * 40,
  driftY: (Math.random() - 0.5) * 40,
  rotateSpeed: 2 + Math.random() * 4,
  color: `hsl(${Math.random() * 60 + 180}, 80%, 55%)`,
  delay: Math.random() * 2,
}));

const ShapeElement: React.FC<{ shape: Shape }> = ({ shape }) => {
  const S = shape.size;
  if (shape.type === 'circle') {
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{ x: '-50%', y: '-50%' }}
        initial={{ left: `${shape.x}%`, top: `${shape.y}%`, opacity: 0, rotate: shape.rotation }}
        animate={{
          top: [`${shape.y}%`, `${shape.y + shape.driftY}%`, `${shape.y}%`],
          left: [`${shape.x}%`, `${shape.x + shape.driftX}%`, `${shape.x}%`],
          rotate: [shape.rotation, shape.rotation + 180 * shape.rotateSpeed, shape.rotation + 360 * shape.rotateSpeed],
          opacity: [0, 0.6, 0.3, 0.7, 0],
          scale: [0, 1.2, 0.8, 1, 0],
        }}
        transition={{ duration: 10 + shape.rotateSpeed * 2, repeat: Infinity, ease: 'easeInOut' as const, delay: shape.delay }}
      >
        <div
          style={{
            width: S, height: S, borderRadius: '50%',
            border: `2px solid ${shape.color}`,
            boxShadow: `0 0 20px ${shape.color}40, inset 0 0 20px ${shape.color}20`,
          }}
        />
      </motion.div>
    );
  }
  if (shape.type === 'triangle') {
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{ x: '-50%', y: '-50%' }}
        initial={{ left: `${shape.x}%`, top: `${shape.y}%`, opacity: 0, rotate: shape.rotation }}
        animate={{
          top: [`${shape.y}%`, `${shape.y - shape.driftY}%`, `${shape.y}%`],
          left: [`${shape.x}%`, `${shape.x - shape.driftX}%`, `${shape.x}%`],
          rotate: [shape.rotation, shape.rotation - 180 * shape.rotateSpeed, shape.rotation - 360 * shape.rotateSpeed],
          opacity: [0, 0.5, 0.2, 0.6, 0],
          scale: [0, 1.1, 0.9, 1, 0],
        }}
        transition={{ duration: 12 + shape.rotateSpeed, repeat: Infinity, ease: 'easeInOut' as const, delay: shape.delay }}
      >
        <div
          style={{
            width: 0, height: 0,
            borderLeft: `${S / 2}px solid transparent`,
            borderRight: `${S / 2}px solid transparent`,
            borderBottom: `${S}px solid ${shape.color}40`,
            filter: `drop-shadow(0 0 12px ${shape.color}30)`,
          }}
        />
      </motion.div>
    );
  }
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ x: '-50%', y: '-50%' }}
      initial={{ left: `${shape.x}%`, top: `${shape.y}%`, opacity: 0, rotate: shape.rotation }}
      animate={{
        top: [`${shape.y}%`, `${shape.y + shape.driftX}%`, `${shape.y}%`],
        left: [`${shape.x}%`, `${shape.x - shape.driftY}%`, `${shape.x}%`],
        rotate: [shape.rotation, shape.rotation + 90 * shape.rotateSpeed, shape.rotation + 180 * shape.rotateSpeed],
        opacity: [0, 0.55, 0.25, 0.65, 0],
        scale: [0, 1.15, 0.85, 1.05, 0],
      }}
      transition={{ duration: 9 + shape.rotateSpeed, repeat: Infinity, ease: 'easeInOut' as const, delay: shape.delay }}
    >
      <div
        style={{
          width: S * 0.7, height: S * 0.7,
          border: `2px solid ${shape.color}`,
          borderRadius: 4,
          boxShadow: `0 0 20px ${shape.color}30, inset 0 0 20px ${shape.color}10`,
          rotate: '45deg',
        }}
      />
    </motion.div>
  );
};

const ParticleBurst: React.FC = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    angle: (Math.PI * 2 * i) / 40 + (Math.random() - 0.5) * 0.5,
    distance: 60 + Math.random() * 140,
    size: 2 + Math.random() * 3,
    color: `hsl(${190 + Math.random() * 40}, 80%, ${55 + Math.random() * 20}%)`,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            background: p.color,
            boxShadow: `0 0 6px ${p.color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [0, Math.cos(p.angle) * p.distance, Math.cos(p.angle) * p.distance * 1.8],
            y: [0, Math.sin(p.angle) * p.distance, Math.sin(p.angle) * p.distance * 1.8],
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{ duration: 2 + Math.random() * 1.5, repeat: Infinity, delay: Math.random() * 3, ease: 'easeOut' as const }}
        />
      ))}
    </div>
  );
};

const NotFound: React.FC = () => {
  const [displayText, setDisplayText] = useState('404');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iteration = useRef(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const currentText = '404';
      const textArr = currentText.split('').map((char, i) => {
        if (i < iteration.current) return char;
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      });
      setDisplayText(textArr.join(''));
      if (iteration.current >= currentText.length) {
        iteration.current = 0;
      } else {
        iteration.current += 1 / 3;
      }
    }, 60);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <main className="bg-background min-h-screen overflow-hidden flex flex-col items-center justify-center relative">
      {/* Floating shapes */}
      {shapes.map(s => <ShapeElement key={s.id} shape={s} />)}

      {/* Particle burst behind text */}
      <ParticleBurst />

      {/* 404 Glitch text */}
      <motion.h1
        className="text-[clamp(6rem,20vw,16rem)] font-black tracking-tighter select-none relative"
        initial={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        style={{
          WebkitTextStroke: '2px hsl(var(--ac))',
          WebkitTextFillColor: 'transparent',
          textShadow: `
            0 0 40px hsl(var(--ac) / 0.3),
            0 0 80px hsl(var(--ac) / 0.15),
            4px 0 hsl(var(--ac) / 0.5), -2px 0 hsl(var(--fg) / 0.3)
          `,
        }}
      >
        {displayText}
      </motion.h1>

      {/* Separator line */}
      <motion.div
        className="h-[2px] w-0 bg-accent/50 rounded-full mb-6"
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' as const }}
      />

      {/* Message */}
      <motion.p
        className="text-foreground/60 text-lg font-light tracking-wide mb-10 text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' as const }}
      >
        The page you're looking for doesn't exist.
      </motion.p>

      {/* Magnetic go home button */}
      <MagneticGoHome />

      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 40%, hsl(var(--ac) / 0.04) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, hsl(var(--fg) / 0.03) 0%, transparent 50%)
          `,
        }}
      />
    </main>
  );
};

const MagneticGoHome: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (isTouchDevice || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width / 2;
    const dy = e.clientY - r.top - r.height / 2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 150;
    if (dist < maxDist) {
      const strength = (1 - dist / maxDist) * 15;
      setPos({ x: dx * strength / dist || 0, y: dy * strength / dist || 0 });
    } else {
      setPos({ x: 0, y: 0 });
    }
  };

  const onLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6, ease: 'easeOut' as const }}
      style={{ x: pos.x, y: pos.y }}
      className="relative"
    >
      <Link
        to="/"
        className="btn btn-primary gap-3 relative overflow-hidden group"
      >
        <motion.span
          animate={{ x: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
        >
          <FiArrowLeft />
        </motion.span>
        Go Home
        <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      </Link>
    </motion.div>
  );
};

export default NotFound;
