import { useState, useCallback } from 'react';
import { validateField } from '../utils/validators';

export const useValidation = (fields) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((name, value, rules) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(value, rules);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const handleBlur = useCallback((name, value, rules) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(value, rules);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const validateAll = useCallback((values) => {
    const newErrors = {};
    const newTouched = {};
    let isValid = true;

    Object.entries(fields).forEach(([name, rules]) => {
      newTouched[name] = true;
      const error = validateField(values[name], rules);
      newErrors[name] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    setTouched(newTouched);
    return isValid;
  }, [fields]);

  const getFieldProps = useCallback((name, rules) => ({
    onChange: (e) => handleChange(name, e.target.value, rules),
    onBlur: (e) => handleBlur(name, e.target.value, rules),
    error: touched[name] ? errors[name] : null,
  }), [handleChange, handleBlur, errors, touched]);

  return { errors, touched, handleChange, handleBlur, validateAll, getFieldProps, setErrors, setTouched };
};
