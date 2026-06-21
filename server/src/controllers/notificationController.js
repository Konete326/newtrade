const { asyncHandler } = require('../utils/asyncHandler');
const notificationService = require('../services/notificationService');

const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await notificationService.getNotifications(
    req.companyId,
    req.user.userId,
    req.user.role,
    { page: Number(page), limit: Number(limit) }
  );
  res.json({
    success: true,
    message: 'Notifications fetched',
    data: result,
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.body;
  await notificationService.markAsRead(
    req.companyId,
    req.user.userId,
    req.user.role,
    notificationId || null
  );
  res.json({ success: true, message: 'Notifications marked as read', data: null });
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const result = await notificationService.getNotifications(
    req.companyId,
    req.user.userId,
    req.user.role,
    { page: 1, limit: 1 }
  );
  res.json({
    success: true,
    message: 'Unread count',
    data: { unreadCount: result.unreadCount },
  });
});

module.exports = { getNotifications, markAsRead, getUnreadCount };
