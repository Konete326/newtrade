const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware, tenantMiddleware);
router.get('/', rbacMiddleware('ADMIN', 'MANAGER'), getUsers);
router.post('/', rbacMiddleware('ADMIN'), createUser);
router.put('/:id', rbacMiddleware('ADMIN'), updateUser);
router.delete('/:id', rbacMiddleware('ADMIN'), deleteUser);

module.exports = router;
