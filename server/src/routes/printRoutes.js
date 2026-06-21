const express = require('express');
const router = express.Router();
const { getInvoiceData, getChallanData, sendInvoiceWhatsApp, sendReminder, sendCustomMessage } = require('../controllers/printController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware, tenantMiddleware);
router.get('/invoice/:id', getInvoiceData);
router.get('/challan/:id', getChallanData);
router.post('/whatsapp/invoice/:id', rbacMiddleware('ADMIN', 'MANAGER', 'SALES'), sendInvoiceWhatsApp);
router.post('/whatsapp/reminder/:customerId', rbacMiddleware('ADMIN', 'MANAGER'), sendReminder);
router.post('/whatsapp/send', rbacMiddleware('ADMIN', 'MANAGER'), sendCustomMessage);

module.exports = router;
