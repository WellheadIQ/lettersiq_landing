import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { formatPhone, submitOperator, validateField } from "../../lib/contact.js";

const FIELDS = ["operator", "name", "email", "phone"];
const EMPTY = { operator: "", name: "", email: "", phone: "" };
const ease = [0.22, 1, 0.36, 1];

const today = () =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

const Blank = ({ name, caption, type = "text", autoComplete, inputMode, value, error, onChange, onBlur, size }) => {
  const errorId = `${name}-error`;
  return (
    <span className={`blank ${error ? "has-error" : ""}`}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required
        size={size}
        style={{ "--size": size }}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      <label htmlFor={name} className="blank-cap">{caption}</label>
      {error && (
        <span id={errorId} className="blank-error">
          {error}
        </span>
      )}
    </span>
  );
};

export const LetterForm = () => {
  const reduceMotion = useReducedMotion();
  const requestRef = useRef(null);
  const [state, setState] = useState("idle");
  const [hydrated, setHydrated] = useState(false);
  const [date, setDate] = useState("");
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setHydrated(true);
    setDate(today());
    return () => requestRef.current?.abort();
  }, []);

  const onChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      const next = name === "phone" ? formatPhone(value) : value;
      setData((prev) => ({ ...prev, [name]: next }));
      if (touched[name]) setErrors((prev) => ({ ...prev, [name]: validateField(name, next) }));
    },
    [touched]
  );

  const onBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (requestRef.current) return;
      const nextErrors = {};
      for (const name of FIELDS) {
        const message = validateField(name, data[name]);
        if (message) nextErrors[name] = message;
      }
      setErrors(nextErrors);
      setTouched({ operator: true, name: true, email: true, phone: true });
      const first = FIELDS.find((name) => nextErrors[name]);
      if (first) {
        document.getElementById(first)?.focus();
        return;
      }

      setState("submitting");
      const controller = new AbortController();
      requestRef.current = controller;
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        await submitOperator(data, { signal: controller.signal });
        setState("success");
        if (typeof window.gtag === "function") {
          window.gtag("event", "conversion", {
            send_to: "AW-16667114456/R0rYCLP-rMkZENj3v4s-",
            event_callback: () => {},
          });
        }
      } catch {
        setState("error");
      } finally {
        clearTimeout(timeout);
        requestRef.current = null;
      }
    },
    [data]
  );

  const reset = useCallback(() => {
    setData(EMPTY);
    setErrors({});
    setTouched({});
    setState("idle");
  }, []);

  const shown = (name) => (touched[name] ? errors[name] : "");
  const sheetMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
        exit: { opacity: 0, y: 60, scaleY: 0.3, rotate: -2, transition: { duration: 0.45, ease } },
      };

  return (
    <div className="letter-slot">
      <AnimatePresence mode="wait" initial={false}>
        {state === "success" ? (
          <Envelope key="sent" operator={data.operator} onReset={reset} reduceMotion={reduceMotion} />
        ) : (
          <motion.form
            key="letter"
            className="letter"
            onSubmit={onSubmit}
            action="https://formcarry.com/s/t84fP1_KPoq"
            method="post"
            noValidate={hydrated}
            aria-busy={state === "submitting"}
            style={{ transformOrigin: "50% 100%" }}
            {...sheetMotion}
          >
            <fieldset disabled={state === "submitting"}>
              <legend className="sr-only">Your operator and contact details</legend>
              <p className="letter-date">{date || "\u00a0"}</p>
              <p className="letter-salutation">Dear LettersIQ,</p>
              <p className="letter-line">
                Please run the Texas portfolio for{" "}
                <Blank name="operator" caption="Operator name" autoComplete="organization" value={data.operator} error={shown("operator")} onChange={onChange} onBlur={onBlur} size={22} />{" "}
                and show me what deserves attention.
              </p>
              <p className="letter-line">
                My name is{" "}
                <Blank name="name" caption="Full name" autoComplete="name" value={data.name} error={shown("name")} onChange={onChange} onBlur={onBlur} size={16} />
                . You can reach me at{" "}
                <Blank name="email" caption="Work email" type="email" inputMode="email" autoComplete="email" value={data.email} error={shown("email")} onChange={onChange} onBlur={onBlur} size={22} />{" "}
                or{" "}
                <Blank name="phone" caption="Phone" type="tel" inputMode="tel" autoComplete="tel" value={data.phone} error={shown("phone")} onChange={onChange} onBlur={onBlur} size={14} />
                .
              </p>
              <p className="letter-signoff">Thank you,</p>
              <p className="letter-signature" aria-hidden="true">{data.name.trim() || "\u00a0"}</p>
            </fieldset>

            {state === "error" && (
              <p role="alert" className="letter-alert">
                We couldn't send your letter. Everything you typed is still here. Try again, or email{" "}
                <a href="mailto:privacy@wellheadiq.com?subject=LettersIQ%20operator%20check">privacy@wellheadiq.com</a>.
              </p>
            )}

            <div className="letter-foot">
              <button type="submit" className="btn btn-red" disabled={state === "submitting"}>
                {state === "submitting" ? "Sending…" : "Send it"} <span aria-hidden="true">→</span>
              </button>
              <p>
                No credit card required. All fields are needed.{" "}
                <a href="/privacy-policy">How we use your information</a>
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

const Envelope = ({ operator, onReset, reduceMotion }) => {
  const focusRef = useRef(null);
  useEffect(() => {
    focusRef.current?.focus();
  }, []);
  const draw = (delay) =>
    reduceMotion
      ? { initial: false }
      : { initial: { pathLength: 0 }, animate: { pathLength: 1, transition: { duration: 0.7, delay, ease } } };

  return (
    <motion.div
      className="sent"
      ref={focusRef}
      tabIndex={-1}
      role="status"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <svg className="sent-envelope" viewBox="0 0 320 210" aria-hidden="true">
        <motion.path className="ink-l" d="M12 20 C90 18 230 21 308 19 C309 80 307 140 309 192 C220 194 100 191 11 193 C12 140 10 80 12 20" {...draw(0)} />
        <motion.path className="ink-l" d="M12 21 C60 60 120 104 160 124 C200 102 260 62 307 20" {...draw(0.35)} />
        <motion.path className="ink-t" d="M12 192 C60 150 100 128 128 110 M308 191 C260 150 220 128 192 110" {...draw(0.6)} />
        <motion.g
          initial={reduceMotion ? false : { opacity: 0, scale: 1.6, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: -9, transition: { delay: 1.1, duration: 0.28, ease: [0.3, 1.4, 0.5, 1] } }}
          style={{ transformOrigin: "236px 150px" }}
        >
          <rect className="sent-stamp" x="170" y="126" width="132" height="48" />
          <text className="sent-stamp-text" x="236" y="158" textAnchor="middle">RECEIVED</text>
        </motion.g>
      </svg>
      <h3 className="sent-title">In the mail.</h3>
      <p className="sent-body">
        We'll run {operator.trim() || "your operator"} through LettersIQ and write back with what we find.
      </p>
      <button type="button" className="btn btn-line" onClick={onReset}>
        Check another operator
      </button>
    </motion.div>
  );
};
