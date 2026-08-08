import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLabel } from './Primitives.jsx';
import { Button } from './ui/button.jsx';
import { IconSwap } from './ui/icon-swap.jsx';
import { blur, distance, duration, easeSmoothOut } from '../lib/motionTokens.js';

// Panel reveal: opening is the invitation and carries the blur, closing gets
// out of the way faster and drops it.
const panelEnter = {
  y: 0,
  filter: 'blur(0px)',
  transition: { duration: duration.slow / 1000, ease: easeSmoothOut },
};
const panelExit = (y) => ({
  y,
  transition: { duration: duration.medium / 1000, ease: easeSmoothOut },
});

const ArrowIcon = () => <span className="block leading-none">&rarr;</span>;

const SpinnerIcon = () => (
  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name', placeholder: 'Jane Roughneck' },
  { name: 'operator', label: 'Operator name', type: 'text', autoComplete: 'organization', placeholder: 'Pioneer Natural Resources' },
  { name: 'email', label: 'Work email', type: 'email', autoComplete: 'email', placeholder: 'you@operator.com' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', placeholder: '(512) 555-0134' },
];

const digits = (v) => v.replace(/\D/g, '').slice(0, 10);

const formatPhone = (v) => {
  const d = digits(v);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

const validateField = (name, value) => {
  const v = (value || '').trim();
  switch (name) {
    case 'name':
      return v.length >= 2 ? '' : 'Enter your full name.';
    case 'operator':
      return v.length >= 2 ? '' : 'Enter your operator or company name.';
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.';
    case 'phone':
      return digits(v).length === 10 ? '' : 'Enter a 10-digit phone number.';
    default:
      return '';
  }
};

export const ContactUs = () => {
  const [formState, setFormState] = useState('idle');
  const [formData, setFormData] = useState({ name: '', operator: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const resetForm = useCallback(() => {
    setErrors({});
    setTouched({});
    setFormData({ name: '', operator: '', email: '', phone: '' });
    setFormState('idle');
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const next = name === 'phone' ? formatPhone(value) : value;
    setFormData((prev) => ({ ...prev, [name]: next }));
    // Only re-validate live once the field has been visited, to clear a
    // showing error as the user fixes it — never punish first-time typing.
    setTouched((t) => {
      if (t[name]) setErrors((prev) => ({ ...prev, [name]: validateField(name, next) }));
      return t;
    });
  }, []);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  const gtagReportConversion = useCallback(() => {
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        send_to: 'AW-16667114456/R0rYCLP-rMkZENj3v4s-',
        event_callback: () => {},
      });
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const nextErrors = {};
      FIELDS.forEach(({ name }) => {
        const msg = validateField(name, formData[name]);
        if (msg) nextErrors[name] = msg;
      });
      setErrors(nextErrors);
      setTouched({ name: true, operator: true, email: true, phone: true });

      if (Object.keys(nextErrors).length > 0) {
        // Move focus to the first field with an error for keyboard/AT users.
        const first = FIELDS.find(({ name }) => nextErrors[name]);
        if (first) document.getElementById(first.name)?.focus();
        return;
      }

      setFormState('submitting');
      try {
        const response = await fetch('https://formcarry.com/s/t84fP1_KPoq', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, phone: digits(formData.phone) }),
        });
        if (!response.ok) throw new Error('Submission failed');
        setFormState('success');
        gtagReportConversion();
      } catch (err) {
        setFormState('error');
      }
    },
    [formData, gtagReportConversion]
  );

  return (
    <section id="contact-us" className="w-full bg-midnight py-16 md:py-24 relative overflow-hidden">
      <div className="section-shell max-w-2xl relative z-10">
        <SectionLabel label="Get started" className="mb-5" />
        <h2 className="text-balance font-display text-display-sm font-extrabold tracking-[-0.02em] text-white">
          Put LettersIQ on your leases.
        </h2>
        <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/65 md:text-lg">
          Tell us who you are and we'll reach out within one business day to get your
          portfolio monitored.
        </p>

        <AnimatePresence mode="wait" initial={false}>
          {formState === 'success' ? (
            <SuccessMessage key="success" onReset={resetForm} />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              noValidate
              initial={{ y: distance.medium, filter: `blur(${blur.small}px)` }}
              animate={panelEnter}
              exit={panelExit(-distance.base)}
              className="mt-8 border border-line bg-card"
            >
              <div className="grid gap-5 p-6 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <FormField
                    key={f.name}
                    {...f}
                    value={formData[f.name]}
                    error={touched[f.name] ? errors[f.name] : ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    full={f.name === 'name' || f.name === 'operator'}
                  />
                ))}
              </div>

              {formState === 'error' && (
                <div
                  role="alert"
                  className="mx-6 mb-2 border border-signalRed/40 bg-signalSoft px-4 py-3 text-sm text-signalBright"
                >
                  We couldn't send your request. Your entries are still here — try again, or{" "}
                  <a
                    href="mailto:privacy@wellheadiq.com?subject=LettersIQ%20access%20request"
                    className="font-semibold underline underline-offset-2 hover:text-white"
                  >
                    email privacy@wellheadiq.com
                  </a>
                  .
                </div>
              )}

              <div className="p-6 pt-2">
                <Button type="submit" disabled={formState === 'submitting'} className="w-full">
                  {formState === 'submitting' ? 'Sending…' : 'Request access'}
                  <IconSwap
                    state={formState === 'submitting' ? 'b' : 'a'}
                    a={<ArrowIcon />}
                    b={<SpinnerIcon />}
                  />
                </Button>
                <p className="mt-3 text-center text-sm text-white/65">
                  No credit card · one business day response
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const SuccessMessage = ({ onReset }) => (
  <motion.div
    initial={{ y: distance.medium, filter: `blur(${blur.small}px)` }}
    animate={panelEnter}
    exit={panelExit(-distance.medium)}
    role="status"
    className="mt-8 border border-cobalt/30 bg-card px-6 py-12 text-center"
  >
    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-cobalt/50 text-cobaltText">
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 className="font-display text-2xl font-bold text-white">Request received</h3>
    <p className="mt-3 text-pretty text-white/65">
      We'll be in touch within one business day to get your portfolio monitored.
    </p>
    <button
      type="button"
      onClick={onReset}
      className="btn-ghost-dark mt-8 min-h-11 px-5 text-sm"
    >
      Submit another request
    </button>
  </motion.div>
);

const FormField = ({ name, label, type, placeholder, autoComplete, value, error, onChange, onBlur, full }) => {
  const errorId = `${name}-error`;
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={type === 'tel' ? 'tel' : type === 'email' ? 'email' : 'text'}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full border bg-midnight/60 px-4 py-3.5 font-mono text-sm text-white placeholder:text-white/45 transition-colors focus:outline-none ${
          error
            ? 'border-signalRed/60 focus:border-signalRed'
            : 'border-line focus:border-cobalt'
        }`}
      />
      {error && (
        <p id={errorId} className="mt-2 text-[13px] text-signalBright">
          {error}
        </p>
      )}
    </div>
  );
};
