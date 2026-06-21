const DatabaseManager = require('./DatabaseManager');

// Role hierarchy: higher index = lower rank
const ROLE_HIERARCHY = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES', 'VIEWER'];

/**
 * Get roles that are ABOVE the given role in hierarchy
 * e.g. MANAGER -> ['SUPER_ADMIN', 'ADMIN']
 */
const getSuperiorRoles = (role) => {
  const idx = ROLE_HIERARCHY.indexOf(role);
  if (idx <= 0) return []; // SUPER_ADMIN has no superiors
  return ROLE_HIERARCHY.slice(0, idx);
};

/**
 * Create a notification visible to superior roles
 */
const createHierarchicalNotification = async (companyId, { type, actorId, actorName, actorRole, title, message }) => {
  try {
    const Notification = DatabaseManager.getModel(companyId, 'NotificationModel');
    if (!Notification) return;

    const visibleTo = getSuperiorRoles(actorRole);
    if (visibleTo.length === 0) return; // SUPER_ADMIN actions create no notifications

    await Notification.create({
      companyId,
      type,
      actorId: String(actorId),
      actorName,
      actorRole,
      visibleTo,
      title,
      message,
    });
  } catch (err) {
    // Don't crash the app if notification fails
    console.error('Notification create error:', err.message);
  }
};

/**
 * Notify when a user logs in
 */
const notifyLogin = async (user) => {
  await createHierarchicalNotification(user.companyId, {
    type: 'LOGIN',
    actorId: user._id,
    actorName: user.name,
    actorRole: user.role,
    title: `${user.name} logged in`,
    message: `${user.role} • ${new Date().toLocaleString()}`,
  });
};

/**
 * Notify when a user logs out
 */
const notifyLogout = async (user) => {
  await createHierarchicalNotification(user.companyId, {
    type: 'LOGOUT',
    actorId: user._id,
    actorName: user.name,
    actorRole: user.role,
    title: `${user.name} logged out`,
    message: `${user.role} • ${new Date().toLocaleString()}`,
  });
};

/**
 * Get notifications for a user based on their role
 * Returns notifications where user's role is in visibleTo array
 */
const getNotifications = async (companyId, userId, userRole, { page = 1, limit = 20 } = {}) => {
  const Notification = DatabaseManager.getModel(companyId, 'NotificationModel');
  if (!Notification) return { notifications: [], unreadCount: 0 };

  const query = {
    companyId,
    visibleTo: userRole,
  };

  const [notifications, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ ...query, isRead: false }),
  ]);

  return { notifications, unreadCount };
};

/**
 * Mark notifications as read for a user
 */
const markAsRead = async (companyId, userId, userRole, notificationId) => {
  const Notification = DatabaseManager.getModel(companyId, 'NotificationModel');
  if (!Notification) return;

  if (notificationId) {
    // Mark single notification
    await Notification.findOneAndUpdate(
      { _id: notificationId, companyId, visibleTo: userRole },
      { isRead: true }
    );
  } else {
    // Mark all as read
    await Notification.updateMany(
      { companyId, visibleTo: userRole, isRead: false },
      { isRead: true }
    );
  }
};

module.exports = {
  notifyLogin,
  notifyLogout,
  getNotifications,
  markAsRead,
  createHierarchicalNotification,
};
