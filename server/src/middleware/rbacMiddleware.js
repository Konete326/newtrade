const { AppError } = require('./errorHandler');

const ROLES = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  MANAGER: 3,
  SALES: 2,
  VIEWER: 1
};

const rbacMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError('Authentication required.', 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions.', 403));
    }
    next();
  };
};

const requireMinRole = (minRole) => {
  return (req, res, next) => {
    const userLevel = ROLES[req.user?.role] || 0;
    const requiredLevel = ROLES[minRole] || 0;
    if (userLevel < requiredLevel) {
      return next(new AppError('Insufficient permissions.', 403));
    }
    next();
  };
};

module.exports = { rbacMiddleware, requireMinRole, ROLES };
