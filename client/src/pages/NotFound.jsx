import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-black">
      <FileQuestion size={64} className="mb-4 text-gray-300 dark:text-gray-600" />
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Page not found</p>
      <Link to="/" className="mt-6 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
        Go to Dashboard
      </Link>
    </div>
  );
}
