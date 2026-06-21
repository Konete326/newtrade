const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().trim().required(),
  sku: Joi.string().trim().required(),
  barcode: Joi.string().allow('').optional(),
  category: Joi.string().allow('').optional(),
  unitHierarchy: Joi.object({
    baseUnit: Joi.object({ name: Joi.string().required(), factor: Joi.number().min(1).required() }).required(),
    secondaryUnit: Joi.object({ name: Joi.string().allow('').optional(), factor: Joi.number().min(1).optional() }).optional(),
    tertiaryUnit: Joi.object({ name: Joi.string().allow('').optional(), factor: Joi.number().min(1).optional() }).optional()
  }).optional(),
  purchasePrice: Joi.number().min(0).optional(),
  salePrices: Joi.object({
    wholesale: Joi.number().min(0).optional(),
    retailer: Joi.number().min(0).optional(),
    custom: Joi.number().min(0).optional()
  }).optional(),
  minStockThreshold: Joi.number().min(0).optional(),
  currentStock: Joi.number().min(0).optional(),
  image: Joi.string().allow('').optional()
});

const stockAdjustSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().required(),
  reason: Joi.string().required(),
  type: Joi.string().valid('WASTAGE', 'DAMAGE', 'ADJUSTMENT').required()
});

module.exports = { productSchema, stockAdjustSchema };
