const express = require('express');
const router = express.Router();
const { getReturns, createReturn, getReturnById } = require('../controllers/returnController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware, tenantMiddleware);
router.get('/', getReturns);
router.get('/:id', getReturnById);
router.post('/', rbacMiddleware('ADMIN', 'MANAGER', 'SALES'), createReturn);

module.exports = router;
