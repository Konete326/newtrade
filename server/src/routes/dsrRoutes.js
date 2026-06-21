const express = require('express');
const router = express.Router();
const { getDsrList, getDsrById, createDsr, settleDsr, getDsrSheet } = require('../controllers/dsrController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware, tenantMiddleware);
router.get('/', getDsrList);
router.get('/:id', getDsrById);
router.get('/:id/sheet', rbacMiddleware('ADMIN', 'MANAGER'), getDsrSheet);
router.post('/', rbacMiddleware('ADMIN', 'MANAGER'), createDsr);
router.post('/:id/settle', rbacMiddleware('ADMIN', 'MANAGER'), settleDsr);

module.exports = router;
