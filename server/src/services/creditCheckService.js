const DatabaseManager = require('./DatabaseManager');
const { AppError } = require('../middleware/errorHandler');

const checkCreditLimit = async (companyId, customerId, newBillAmount) => {
  const Customer = DatabaseManager.getModel(companyId, 'CustomerModel');
  const customer = await Customer.findOne({ _id: customerId, companyId, isDeleted: false });
  if (!customer) throw new AppError('Customer not found.', 404);
  if (customer.creditLimit <= 0) return { allowed: true, customer };
  const projected = customer.currentBalance + newBillAmount;
  if (projected > customer.creditLimit) {
    return {
      allowed: false,
      customer,
      currentBalance: customer.currentBalance,
      creditLimit: customer.creditLimit,
      projected,
      overBy: projected - customer.creditLimit
    };
  }
  return { allowed: true, customer };
};

module.exports = { checkCreditLimit };

