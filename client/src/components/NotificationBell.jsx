import { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, LogIn, LogOut, Activity } from 'lucide-react';
import { notificationService } from '../services/notificationService';

const POLL_INTERVAL = 30000; // 30 seconds

const typeIcons = {
  LOGIN: LogIn,
  LOGOUT: LogOut,
  ACTIVITY: Activity,
};

const typeColors = {
  LOGIN: 'text-success-600 dark:text-success-400',
  LOGOUT: 'text-warning-600 dark:text-warning-400',
  ACTIVITY: 'text-brand-600 dark:text-brand-400',
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // Poll for unread count
  useEffect(() => {
    let active = true;
    const fetchCount = () => {
      notificationService.getUnreadCount()
        .then((res) => { if (active) setUnreadCount(res.data.data.unreadCount); })
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, POLL_INTERVAL);
    return () => { active = false; clearInterval(interval); };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = async () => {
    setOpen(!open);
    if (!open) {
      setLoading(true);
      try {
        const res = await notificationService.getAll({ limit: 30 });
        setNotifications(res.data.data.notifications || []);
        setUnreadCount(res.data.data.unreadCount || 0);
      } catch {}
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-error-100 px-2 py-0.5 text-xs font-medium text-error-600 dark:bg-error-500/15 dark:text-error-400">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => {
                const Icon = typeIcons[n.type] || Activity;
                return (
                  <button
                    key={n._id}
                    onClick={() => !n.isRead && handleMarkRead(n._id)}
                    className={`flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 ${
                      !n.isRead ? 'bg-brand-50/50 dark:bg-brand-500/5' : ''
                    }`}
                  >
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 ${typeColors[n.type]}`}>
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-600 dark:text-gray-400'}`}>
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">{n.message}</p>
                      <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-600">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.isRead && (
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center py-8">
                <Bell size={24} className="text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
