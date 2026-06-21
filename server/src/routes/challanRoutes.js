const express = require('express');
const router = express.Router();
const { getChallans, getChallanById, createChallan, updateStatus } = require('../controllers/challanController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware, tenantMiddleware);
router.get('/', getChallans);
router.get('/:id', getChallanById);
router.post('/', rbacMiddleware('ADMIN', 'MANAGER', 'SALES'), createChallan);
router.patch('/:id/status', rbacMiddleware('ADMIN', 'MANAGER'), updateStatus);

module.exports = router;
