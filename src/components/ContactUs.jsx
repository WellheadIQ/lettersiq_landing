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

  // Reset form after successful submission
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
      }, 60000); // 60000 milliseconds = 1 minute
      return () => clearTimeout(timer);
    }
  }, [formState]);

  // Validate individual field
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

  // Handle input change
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

  // Validate entire form
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

  // Handle form submission
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

  // Google Analytics conversion tracking
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
    <section id="contact-us" className="w-full flex flex-col items-center justify-center py-12 bg-customDarkBg2">
      <h2 className="text-3xl font-bold text-white mb-8">Contact Us</h2>
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
            className="w-full max-w-lg space-y-6"
          >
            {formState === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-red-500 text-center"
              >
                Please fix the errors in the form and try again.
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
    </section>
  );
};

// Success message component
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
      We'll get back to you within 24 hours!
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

// Contact form component
const ContactForm = ({ formState, formData, errors, validFields, handleInputChange, handleSubmit }) => (
  <motion.form
    onSubmit={handleSubmit}
    className="w-full space-y-4"
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
        isValid={validFields[field]}
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
      <button
        type="submit"
        disabled={formState === 'submitting'}
        className="bg-customPrimary text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
      >
        {formState === 'submitting' ? 'Submitting...' : 'Submit'}
      </button>
    </motion.div>
  </motion.form>
);

// Form field component
const FormField = ({ field, value, error, isValid, onChange, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="relative"
  >
    <label htmlFor={field} className="block text-white mb-2">
      {field.charAt(0).toUpperCase() + field.slice(1)}
    </label>
    <div className="relative">
      <input
        type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
        id={field}
        name={field}
        value={value}
        onChange={onChange}
        className={`w-full p-2 pr-10 rounded ${
          isValid ? 'border-green-500' : error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      <motion.div
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isValid ? (
          <FaCheck className="text-green-500" />
        ) : error ? (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <FaTimes className="text-red-500" />
          </motion.div>
        ) : null}
      </motion.div>
    </div>
    {error && (
      <motion.p
        className="text-red-500 text-sm mt-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);
