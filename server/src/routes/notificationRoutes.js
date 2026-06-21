const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { getNotifications, markAsRead, getUnreadCount } = require('../controllers/notificationController');

const router = express.Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.post('/mark-read', markAsRead);

module.exports = router;
