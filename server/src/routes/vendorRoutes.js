const express = require('express');
const router = express.Router();
const { getVendors, getVendorById, createVendor, updateVendor, deleteVendor, getVendorLedger } = require('../controllers/vendorController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware, tenantMiddleware);
router.get('/', getVendors);
router.get('/:id', getVendorById);
router.get('/:id/ledger', rbacMiddleware('ADMIN', 'MANAGER'), getVendorLedger);
router.post('/', rbacMiddleware('ADMIN', 'MANAGER'), createVendor);
router.put('/:id', rbacMiddleware('ADMIN', 'MANAGER'), updateVendor);
router.delete('/:id', rbacMiddleware('ADMIN'), deleteVendor);

module.exports = router;
