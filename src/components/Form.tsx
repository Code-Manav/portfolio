import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { FadeInUp } from './';

interface FormState {
  user_name: string;
  user_email: string;
  user_subject: string;
  message: string;
}

const fieldVariant = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' as const },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: 0.2 + i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const shakeVariants = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.5 },
  },
};

const Form: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    user_name: '',
    user_email: '',
    user_subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [shake, setShake] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    if (!form.user_name || !form.user_email || !form.message) {
      triggerShake();
      return;
    }

    setSending(true);
    emailjs.sendForm('service_757vv2o', 'template_ffspylb', formRef.current, 'I5l151BvmVvcrRudC')
      .then(() => {
        setSent(true);
        setForm({ user_name: '', user_email: '', user_subject: '', message: '' });
        setTimeout(() => setSent(false), 4000);
      })
      .catch((err: any) => alert(err.text))
      .finally(() => setSending(false));
  };

  const inputClasses =
    'w-full bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none transition-all duration-300';
  const labelClasses =
    'block text-xs font-black uppercase tracking-[0.2em] text-accent mb-2 ml-1';

  return (
    <FadeInUp delay={0.2}>
      <motion.div
        className="max-w-2xl mx-auto w-full glass-card p-8 md:p-12 mt-12 bg-card relative overflow-hidden"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' as const }}
      >
        {/* Decorative corner glow */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const, delay: 1 }}
        />

        <form
          ref={formRef}
          onSubmit={sendEmail}
          className="space-y-8 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="space-y-2"
              variants={fieldVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              <label className={labelClasses}>Your Name</label>
              <motion.input
                type="text"
                name="user_name"
                value={form.user_name}
                onChange={handleChange}
                onFocus={() => setFocusedField('user_name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Elon Musk"
                className={inputClasses}
                required
                variants={shakeVariants}
                animate={shake && focusedField === null ? 'shake' : {}}
                whileFocus={{
                  scale: 1.02,
                  borderColor: 'hsl(var(--ac) / 0.5)',
                  boxShadow: '0 0 20px hsl(var(--ac) / 0.1)',
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            <motion.div
              className="space-y-2"
              variants={fieldVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              <label className={labelClasses}>Email Address</label>
              <motion.input
                type="email"
                name="user_email"
                value={form.user_email}
                onChange={handleChange}
                onFocus={() => setFocusedField('user_email')}
                onBlur={() => setFocusedField(null)}
                placeholder="elon@spacex.com"
                className={inputClasses}
                required
                variants={shakeVariants}
                animate={shake && focusedField === null ? 'shake' : {}}
                whileFocus={{
                  scale: 1.02,
                  borderColor: 'hsl(var(--ac) / 0.5)',
                  boxShadow: '0 0 20px hsl(var(--ac) / 0.1)',
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </div>

          <motion.div
            className="space-y-2"
            variants={fieldVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            <label className={labelClasses}>Subject</label>
            <motion.input
              type="text"
              name="user_subject"
              value={form.user_subject}
              onChange={handleChange}
              onFocus={() => setFocusedField('user_subject')}
              onBlur={() => setFocusedField(null)}
              placeholder="Project Collaboration"
              className={inputClasses}
              required
              whileFocus={{
                scale: 1.02,
                borderColor: 'hsl(var(--ac) / 0.5)',
                boxShadow: '0 0 20px hsl(var(--ac) / 0.1)',
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            variants={fieldVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
          >
            <label className={labelClasses}>Message</label>
            <motion.textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              rows={6}
              placeholder="Tell me about your vision..."
              className={`${inputClasses} resize-none`}
              required
              variants={shakeVariants}
              animate={shake && focusedField === null ? 'shake' : {}}
              whileFocus={{
                scale: 1.02,
                borderColor: 'hsl(var(--ac) / 0.5)',
                boxShadow: '0 0 20px hsl(var(--ac) / 0.1)',
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          <motion.div
            variants={fieldVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
          >
            <motion.button
              type="submit"
              disabled={sending || sent}
              className="btn btn-primary w-full py-4 text-xs tracking-[0.3em] relative overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px hsl(var(--ac) / 0.25)' }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.span
                    key="sent"
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-none stroke-current"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' as const }}
                    >
                      <motion.path
                        d="M5 12l5 5 9-9"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                    SENT SUCCESSFULLY
                  </motion.span>
                ) : sending ? (
                  <motion.span
                    key="sending"
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.span
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' as const }}
                    />
                    SENDING...
                  </motion.span>
                ) : (
                  <motion.span
                    key="send"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    SEND MESSAGE
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Button shimmer */}
              <motion.span
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent pointer-events-none"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' as const, delay: 1 }}
              />
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </FadeInUp>
  );
};

export default Form;
