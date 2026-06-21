import { PackageOpen } from 'lucide-react';

export default function EmptyState({ title = 'No data found', message = 'There are no records to display at the moment.', icon: Icon = PackageOpen, action = null }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
        <Icon size={48} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="mb-6 max-w-sm text-center text-sm text-gray-500 dark:text-gray-400">{message}</p>
      {action}
    </div>
  );
}
