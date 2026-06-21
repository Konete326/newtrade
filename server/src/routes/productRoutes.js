const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, findByBarcode } = require('../controllers/productController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { tenantMiddleware } = require('../middleware/tenantMiddleware');
const { rbacMiddleware } = require('../middleware/rbacMiddleware');
const { validate } = require('../middleware/validator');
const { productSchema } = require('../validators/productValidator');

router.use(authMiddleware, tenantMiddleware);
router.get('/', getProducts);
router.get('/barcode/:code', findByBarcode);
router.get('/:id', getProductById);
router.post('/', rbacMiddleware('ADMIN', 'MANAGER'), validate(productSchema), createProduct);
router.put('/:id', rbacMiddleware('ADMIN', 'MANAGER'), validate(productSchema), updateProduct);
router.delete('/:id', rbacMiddleware('ADMIN'), deleteProduct);

module.exports = router;
