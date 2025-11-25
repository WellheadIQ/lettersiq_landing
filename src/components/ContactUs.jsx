import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';

export const ContactUs = () => {
  const [formState, setFormState] = useState('idle');
  const [formData, setFormData] = useState({
    name: '',
    operator: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});

  useEffect(() => {
    if (formState === 'success') {
      const timer = setTimeout(() => {
        setErrors({});
        setValidFields({});
        setFormData({
          name: '',
          operator: '',
          email: '',
          phone: ''
        });
        setFormState('idle');
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [formState]);

  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
      case 'operator':
        return value.length >= 2;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phone':
        return /^\d{10}$/.test(value);
      default:
        return false;
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const isValid = validateField(name, value);
    setValidFields(prev => ({ ...prev, [name]: isValid }));

    if (isValid) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    } else {
      let errorMessage = '';
      switch (name) {
        case 'name':
        case 'operator':
          errorMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least 2 characters`;
          break;
        case 'email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'phone':
          errorMessage = 'Phone number must be 10 digits';
          break;
        default:
          errorMessage = 'Invalid input';
      }
      setErrors(prev => ({ ...prev, [name]: errorMessage }));
    }
  }, [validateField]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    Object.keys(formData).forEach(field => {
      if (!validateField(field, formData[field])) {
        newErrors[field] = `Please enter a valid ${field}`;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setFormState('submitting');

    if (!validateForm()) {
      setFormState('error');
      return;
    }

    try {
      const response = await fetch('https://formcarry.com/s/t84fP1_KPoq', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Submission failed');
      setFormState('success');
      gtag_report_conversion();
    } catch (error) {
      console.error('Submission error:', error);
      setFormState('error');
    }
  }, [formData, validateForm]);

  const gtag_report_conversion = useCallback(() => {
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        'send_to': 'AW-16667114456/R0rYCLP-rMkZENj3v4s-',
        'event_callback': () => console.log('Conversion tracked successfully')
      });
    } else {
      console.warn('gtag function not available');
    }
  }, []);

  return (
    <section id="contact-us" className="w-full bg-labFg py-16 md:py-24 relative">
      {/* Technical grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-2xl mx-auto px-6 md:px-8 relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-mono text-xs text-labBg/60 uppercase tracking-widest">07</span>
          <span className="w-12 h-px bg-labBg/20" />
          <span className="font-mono text-xs text-labBg/60 uppercase tracking-widest">CONTACT</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-labBg mb-4">
            Get Started
          </h2>
          <p className="text-labBg/70">
            Fill out the form below and we'll reach out within 24 hours.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {formState === 'success' ? (
            <SuccessMessage key="success" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {formState === 'error' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 border border-red-500/50 bg-red-500/10 text-red-400 font-mono text-sm"
                >
                  /// ERROR: Please fix the errors in the form and try again.
                </motion.div>
              )}
              <ContactForm
                formState={formState}
                formData={formData}
                errors={errors}
                validFields={validFields}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const SuccessMessage = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.5 }}
    className="text-center py-12 border border-labBg/20 bg-labBg/5"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="w-16 h-16 mx-auto mb-6 border-2 border-green-500 flex items-center justify-center"
    >
      <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </motion.div>
    <h3 className="text-2xl font-bold text-labBg mb-4">
      Submission Received
    </h3>
    <p className="text-labBg/70 mb-2">
      We'll get back to you within 24 hours.
    </p>
    <p className="font-mono text-xs text-labAccent">
      /// WELCOME TO LETTERSIQ
    </p>
  </motion.div>
);

const ContactForm = ({ formState, formData, errors, validFields, handleInputChange, handleSubmit }) => (
  <motion.form
    onSubmit={handleSubmit}
    className="border border-labBg/20 bg-labBg/5"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Form header */}
    <div className="p-4 border-b border-labBg/20 flex items-center justify-between">
      <span className="font-mono text-xs text-labBg/60">FORM_CONTACT</span>
      <span className="font-mono text-xs text-labBg/60">FIELDS: 4</span>
    </div>

    <div className="p-6 space-y-6">
      {['name', 'operator', 'email', 'phone'].map((field, index) => (
        <FormField
          key={field}
          field={field}
          value={formData[field]}
          error={errors[field]}
          isValid={validFields[field]}
          onChange={handleInputChange}
          index={index}
        />
      ))}
    </div>

    {/* Submit button */}
    <div className="p-6 pt-0">
      <motion.button
        type="submit"
        disabled={formState === 'submitting'}
        className="w-full py-4 bg-labAccent text-labBg font-mono text-sm uppercase tracking-wider hover:bg-labBg hover:text-labFg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: formState === 'submitting' ? 1 : 1.01 }}
        whileTap={{ scale: formState === 'submitting' ? 1 : 0.99 }}
      >
        {formState === 'submitting' ? '/// PROCESSING...' : 'Submit Request'}
      </motion.button>
    </div>
  </motion.form>
);

const FormField = ({ field, value, error, isValid, onChange, index }) => {
  const labels = {
    name: 'Full Name',
    operator: 'Operator Name',
    email: 'Email Address',
    phone: 'Phone Number'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={field} className="font-mono text-xs text-labBg/60 uppercase tracking-wider">
          {labels[field]}
        </label>
        <span className="font-mono text-xs text-labBg/40">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="relative">
        <input
          type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
          id={field}
          name={field}
          value={value}
          onChange={onChange}
          placeholder={field === 'phone' ? '10 digits, no dashes' : ''}
          className={`w-full p-4 bg-transparent border text-labBg font-mono text-sm focus:outline-none transition-colors ${
            isValid 
              ? 'border-green-500/50 focus:border-green-500' 
              : error 
                ? 'border-red-500/50 focus:border-red-500' 
                : 'border-labBg/20 focus:border-labBg/50'
          }`}
        />
        {/* Validation indicator */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isValid ? (
            <FaCheck className="text-green-500 w-4 h-4" />
          ) : error ? (
            <FaTimes className="text-red-500 w-4 h-4" />
          ) : null}
        </div>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 font-mono text-xs text-red-400"
        >
          /// {error}
        </motion.p>
      )}
    </motion.div>
  );
};
