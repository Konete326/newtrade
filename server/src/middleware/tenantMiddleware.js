const DatabaseManager = require('../services/DatabaseManager');
const { AppError } = require('./errorHandler');

const tenantMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.companyId) {
      throw new AppError('Tenant context not found.', 401);
    }
    const conn = await DatabaseManager.getConnection(req.user.companyId);
    req.tenantDb = conn;
    req.companyId = req.user.companyId;
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError('Failed to resolve tenant database.', 401));
  }
};

module.exports = { tenantMiddleware };
