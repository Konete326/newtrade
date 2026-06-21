import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validators } from '../../utils/validators';
import { Store, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateEmail = (val) => {
    const req = validators.required(val);
    if (req) return req;
    return validators.email(val);
  };

  const validatePassword = (val) => {
    const req = validators.required(val);
    if (req) return req;
    if (val.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleChange = (field, value, validator) => {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors((p) => ({ ...p, [field]: validator(value) }));
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    setServerError('');
  };

  const handleBlur = (field, value, validator) => {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors((p) => ({ ...p, [field]: validator(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setTouched({ email: true, password: true });
    setErrors({ email: emailErr, password: passErr });
    if (emailErr || passErr) return;
    setSubmitting(true);
    setServerError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-500/20">
            <Store size={32} className="text-brand-600 dark:text-brand-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trader Desktop</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Wholesale Market ERP — Sign in to continue</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
          {serverError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-700 dark:bg-error-500/10 dark:text-error-400">
              <AlertCircle size={16} />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="text"
                value={email}
                onChange={(e) => handleChange('email', e.target.value, validateEmail)}
                onBlur={(e) => handleBlur('email', e.target.value, validateEmail)}
                placeholder="e.g. admin@traderdesk.com"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500 ${
                  touched.email && errors.email
                    ? 'border-error-400 focus:border-error-400 focus:ring-error-500/10'
                    : 'border-gray-200 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700'
                }`}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value, validatePassword)}
                  onBlur={(e) => handleBlur('password', e.target.value, validatePassword)}
                  placeholder="Enter your password"
                  className={`w-full rounded-lg border px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500 ${
                    touched.password && errors.password
                      ? 'border-error-400 focus:border-error-400 focus:ring-error-500/10'
                      : 'border-gray-200 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          Trader Desktop v1.0 — Pakistani Wholesale Market ERP
        </p>
      </div>
    </div>
  );
}
