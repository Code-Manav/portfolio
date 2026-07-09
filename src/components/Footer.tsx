import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaPhone, FaMailBulk, FaLinkedin, FaGithub } from 'react-icons/fa';

const socials = [
  { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/manav-shori-561957126', label: 'LinkedIn' },
  { icon: <FaGithub />, href: 'https://github.com/manavshori', label: 'GitHub' },
];

const contacts = [
  { icon: <FaHome className="text-accent mt-0.5 shrink-0" />, text: ['Vadodara', 'Gujarat, India'] },
  { icon: <FaPhone className="text-accent mt-0.5 shrink-0" />, text: ['9537008678'] },
  { icon: <FaMailBulk className="text-accent mt-0.5 shrink-0" />, text: ['manav.shori30@gmail.com'] },
];

const staggerItem = (i: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  },
});

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const yearRef = React.useRef<HTMLSpanElement>(null);

  return (
    <motion.footer
      className="border-t border-accent/10 mt-16 pt-16 pb-8 px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Top gradient line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-accent/40 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeInOut' as const }}
      />

      {/* Floating bg particles */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: 'hsl(var(--ac) / 0.04)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -15 - Math.random() * 15, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut' as const,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        {/* Contact */}
        <motion.div
          variants={staggerItem(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-base font-black tracking-tight mb-7 inline-block"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            GET IN TOUCH<span className="text-accent">.</span>
          </motion.h3>
          <div className="flex flex-col gap-5">
            {contacts.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 group"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
              >
                <motion.span
                  whileHover={{ scale: 1.2, color: 'hsl(var(--ac))' }}
                  transition={{ type: 'spring' as const, stiffness: 400, damping: 10 }}
                >
                  {item.icon}
                </motion.span>
                <div>
                  {item.text.map(t => (
                    <motion.p
                      key={t}
                      className="text-muted text-sm group-hover:text-foreground transition-colors duration-300"
                    >
                      {t}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          variants={staggerItem(1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-base font-black tracking-tight mb-7 inline-block"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            MISSION<span className="text-accent">.</span>
          </motion.h3>
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <motion.span
              className="absolute -top-3 -left-2 text-3xl text-accent/20 font-serif leading-none select-none"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
            >
              "
            </motion.span>
            <p className="text-muted text-sm leading-relaxed italic font-light max-w-xs pl-4 border-l-2 border-accent/20">
              Building production-ready, full-stack applications with clean architecture, scalable APIs, and cloud-native deployments — solving real-world problems through technology.
            </p>
          </motion.div>
        </motion.div>

        {/* Social */}
        <motion.div
          variants={staggerItem(2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-base font-black tracking-tight mb-7 inline-block"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            CONNECT<span className="text-accent">.</span>
          </motion.h3>
          <div className="flex gap-4">
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-3 rounded-xl text-accent text-xl relative overflow-hidden"
                aria-label={s.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.15, type: 'spring' as const, stiffness: 300, damping: 16 }}
                whileHover={{ scale: 1.15, y: -4, boxShadow: '0 8px 30px hsl(var(--ac) / 0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, hsl(var(--ac) / 0.15), transparent 70%)',
                  }}
                />
                <span className="relative z-10 flex">{s.icon}</span>
              </motion.a>
            ))}
          </div>
          <motion.p
            className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Est. 2021 · Manav Shori
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        className="max-w-7xl mx-auto border-t border-accent/5 mt-12 pt-6 flex flex-col md:flex-row justify-between gap-3"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-[10px] font-bold tracking-widest text-foreground/20 uppercase">
          Designed & Engineered by Manav Shori © {currentYear}
        </p>
        <motion.p
          className="text-[10px] font-black text-accent/40 uppercase tracking-widest"
          whileHover={{ color: 'hsl(var(--ac) / 0.8)' }}
          transition={{ duration: 0.3 }}
        >
          Built with React · Vite · Tailwind
        </motion.p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
