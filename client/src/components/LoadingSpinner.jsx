import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', fullScreen = false }) {
  const sizes = { sm: 20, md: 32, lg: 48 };
  const spinner = (
    <Loader2
      size={sizes[size] || sizes.md}
      className="animate-spin text-brand-500"
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/80 dark:bg-black/80">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
}
