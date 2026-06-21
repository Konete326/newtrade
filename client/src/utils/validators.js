export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) return 'This field is required';
    return null;
  },
  email: (value) => {
    if (!value) return null;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? null : 'Enter a valid email (e.g. user@example.com)';
  },
  phone: (value) => {
    if (!value) return null;
    const regex = /^(\+92|0)?3[0-9]{9}$/;
    return regex.test(value.replace(/\s/g, '')) ? null : 'Enter valid Pakistani phone (e.g. 03001234567)';
  },
  number: (value) => {
    if (value === '' || value === null || value === undefined) return null;
    return !isNaN(value) && Number(value) >= 0 ? null : 'Enter a valid positive number';
  },
  positiveNumber: (value) => {
    if (value === '' || value === null || value === undefined) return null;
    return !isNaN(value) && Number(value) > 0 ? null : 'Must be greater than zero';
  },
  min: (min) => (value) => {
    if (!value) return null;
    return Number(value) >= min ? null : `Minimum value is ${min}`;
  },
  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : `Maximum ${max} characters allowed`;
  },
  cnic: (value) => {
    if (!value) return null;
    const regex = /^[0-9]{5}-?[0-9]{7}-?[0-9]$/;
    return regex.test(value) ? null : 'Enter valid CNIC (e.g. 42101-1234567-1)';
  },
  barcode: (value) => {
    if (!value) return null;
    const regex = /^[A-Za-z0-9-]{3,50}$/;
    return regex.test(value) ? null : 'Enter valid barcode (3-50 alphanumeric characters)';
  },
  sku: (value) => {
    if (!value) return null;
    const regex = /^[A-Za-z0-9-]{2,30}$/;
    return regex.test(value) ? null : 'SKU: 2-30 letters, numbers, or hyphens only';
  },
  password: (value) => {
    if (!value) return null;
    return value.length >= 6 ? null : 'Minimum 6 characters required';
  },
  alphaOnly: (value) => {
    if (!value) return null;
    return /^[a-zA-Z\s]*$/.test(value) ? null : 'Only letters and spaces allowed';
  },
};

// Input filters — strip invalid characters on each keystroke
export const inputFilters = {
  numbersOnly: (value) => value.replace(/[^0-9]/g, ''),
  decimalOnly: (value) => value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'),
  alphaOnly: (value) => value.replace(/[^a-zA-Z\s]/g, ''),
  alphaNumeric: (value) => value.replace(/[^a-zA-Z0-9\s-]/g, ''),
};

export const validateField = (value, rules) => {
  for (const rule of rules) {
    const error = typeof rule === 'function' ? rule(value) : null;
    if (error) return error;
  }
  return null;
};
