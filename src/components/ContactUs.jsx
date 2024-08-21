import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ContactUs = () => {
  const [formState, setFormState] = useState('idle');
  const [formData, setFormData] = useState({
    name: '',
    operator: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (formData.operator.length < 2) newErrors.operator = 'Operator must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState('submitting');
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
  }, [formData]);

  const gtag_report_conversion = useCallback(() => {
    gtag('event', 'conversion', {
      'send_to': 'AW-16667114456/R0rYCLP-rMkZENj3v4s-',
      'event_callback': () => console.log('Conversion tracked successfully')
    });
  }, []);

  return (
    <section id="contact-us" className="w-full flex flex-col items-center justify-center py-12 bg-customDarkBg2">
      <h2 className="text-3xl font-bold text-white mb-8">Contact Us</h2>
      <AnimatePresence mode="wait">
        {formState === 'success' ? (
          <SuccessMessage key="success" />
        ) : (
          <ContactForm
            key="form"
            formState={formState}
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const SuccessMessage = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.5 }}
    className="text-white text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.5, times: [0, 0.8, 1] }}
      className="text-6xl mb-6 flex justify-center space-x-4"
    >
      {['🎉', '🚀', '👍'].map((emoji, index) => (
        <motion.span
          key={emoji}
          role="img"
          aria-label={`Emoji ${index + 1}`}
          whileHover={{ rotate: 20, scale: 1.2 }}
          whileTap={{ rotate: 0, scale: 0.8 }}
        >
          {emoji}
        </motion.span>
      ))}
    </motion.div>
    <motion.h3 
      className="text-2xl font-bold mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      Thank you for reaching out!
    </motion.h3>
    <motion.p 
      className="mb-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      We'll reach out to you within 24 hours!
    </motion.p>
    <motion.p 
      className="text-customSecondary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      Welcome to the LettersIQ family! 🎊
    </motion.p>
  </motion.div>
);

const ContactForm = ({ formState, formData, errors, handleInputChange, handleSubmit }) => (
  <motion.form
    className="w-full max-w-lg space-y-6"
    onSubmit={handleSubmit}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {['name', 'operator', 'email', 'phone'].map((field, index) => (
      <FormField
        key={field}
        field={field}
        value={formData[field]}
        error={errors[field]}
        onChange={handleInputChange}
        delay={index * 0.1}
      />
    ))}
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <SubmitButton formState={formState} />
    </motion.div>
  </motion.form>
);

const FormField = ({ field, value, error, onChange, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <input
      name={field}
      value={value}
      onChange={onChange}
      className={`w-full bg-gray-700 text-white border ${error ? 'border-red-500' : 'border-gray-600'} rounded-md py-3 px-4 leading-tight focus:outline-none focus:bg-gray-600`}
      type={field === 'email' ? 'email' : 'text'}
      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
    />
    {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
  </motion.div>
);

const SubmitButton = ({ formState }) => (
  <motion.button
    className="bg-customPrimary hover:bg-customPrimaryDark text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out"
    type="submit"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    disabled={formState === 'submitting'}
  >
    {formState === 'submitting' ? (
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="inline-block"
      >
        ⚙️
      </motion.span>
    ) : (
      "Submit"
    )}
  </motion.button>
);