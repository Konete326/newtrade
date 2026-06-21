const statusColors = {
  COMPLETED: 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400',
  PENDING: 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400',
  APPROVED: 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400',
  REJECTED: 'bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400',
  DISPATCHED: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400',
  DELIVERED: 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400',
  PARTIALLY_DELIVERED: 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400',
  RETURNED: 'bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400',
  PARTIALLY_RETURNED: 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400',
  ACTIVE: 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400',
  SETTLED: 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400',
  CASH: 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400',
  CREDIT: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400',
};

export default function StatusBadge({ status }) {
  const color = statusColors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400';
  const label = status?.replace(/_/g, ' ') || '';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${color}`}>
      {label.toLowerCase()}
    </span>
  );
}
