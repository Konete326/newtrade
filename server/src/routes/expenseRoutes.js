const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getExpenses, getExpenseById, createExpense, approveExpense, rejectExpense, deleteExpense } = require('../controllers/expenseController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(authMiddleware, tenantMiddleware);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.post('/', rbacMiddleware('ADMIN', 'MANAGER', 'SALES'), upload.array('attachments', 5), createExpense);
router.post('/:id/approve', rbacMiddleware('ADMIN'), approveExpense);
router.post('/:id/reject', rbacMiddleware('ADMIN'), rejectExpense);
router.delete('/:id', rbacMiddleware('ADMIN'), deleteExpense);

module.exports = router;
