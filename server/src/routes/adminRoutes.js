const express = require('express');
const router = express.Router();
const { getAllTenants, getTenantById, createTenant, updateTenant, suspendTenant, activateTenant, getSystemHealth } = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');

router.use(authMiddleware);
router.use(rbacMiddleware('SUPER_ADMIN'));
router.get('/health', getSystemHealth);
router.get('/tenants', getAllTenants);
router.get('/tenants/:id', getTenantById);
router.post('/tenants', createTenant);
router.put('/tenants/:id', updateTenant);
router.post('/tenants/:id/suspend', suspendTenant);
router.post('/tenants/:id/activate', activateTenant);

module.exports = router;
