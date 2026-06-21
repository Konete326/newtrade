import { useState, useCallback } from 'react';
import { validateField } from '../utils/validators';

/**
 * FormInput — reusable input with real-time validation, input filtering, and error display.
 *
 * Props:
 *   label       — field label text
 *   name        — field name (for accessibility)
 *   value       — controlled value
 *   onChange     — (value) => void  — called with filtered value
 *   rules       — array of validator functions from validators.js
 *   filter      — input filter function from inputFilters (e.g. numbersOnly)
 *   type        — HTML input type (text, password, email, date, number, etc.)
 *   placeholder — input placeholder
 *   required    — shows red asterisk on label
 *   disabled    — disables input
 *   className   — extra classes on wrapper div
 *   as          — 'input' (default) or 'textarea'
 *   rows        — textarea rows (when as="textarea")
 *   children    — for select elements (pass <option> children)
 */
export default function FormInput({
  label, name, value, onChange, rules = [], filter, type = 'text',
  placeholder, required, disabled, className = '', as = 'input', rows = 3, children,
}) {
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((e) => {
    let val = e.target.value;
    if (filter) val = filter(val);
    onChange(val);
  }, [onChange, filter]);

  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  const error = touched ? validateField(value, rules) : null;

  const baseClass = `w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-black dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 transition`;
  const borderClass = error
    ? 'border-error-400 focus:border-error-400 focus:ring-error-500/10'
    : 'border-gray-200 dark:border-gray-700 focus:border-brand-300 focus:ring-brand-500/10';

  const InputTag = as === 'textarea' ? 'textarea' : children ? 'select' : 'input';

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}{required && <span className="ml-0.5 text-error-500">*</span>}
        </label>
      )}
      <InputTag
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseClass} ${borderClass}`}
        {...(InputTag === 'input' && { type })}
        {...(as === 'textarea' && { rows })}
      >
        {children}
      </InputTag>
      {error && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{error}</p>}
    </div>
  );
}
