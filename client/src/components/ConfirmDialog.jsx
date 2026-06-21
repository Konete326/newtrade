import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ onConfirm, onCancel, title = 'Confirm Action', message = 'Are you sure?', confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) {
  const btnColor = variant === 'danger' ? 'bg-error-600 hover:bg-error-700' : 'bg-brand-600 hover:bg-brand-700';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${variant === 'danger' ? 'bg-error-100 dark:bg-error-500/15' : 'bg-brand-100 dark:bg-brand-500/15'}`}>
            <AlertTriangle size={20} className={variant === 'danger' ? 'text-error-600' : 'text-brand-600'} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">{cancelText}</button>
          <button onClick={onConfirm} className={`rounded-lg px-4 py-2.5 text-sm font-medium text-white transition ${btnColor}`}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
