const DatabaseManager = require('./DatabaseManager');

const getRunningBalance = async (companyId, partyType, partyId) => {
  const Transaction = DatabaseManager.getModel(companyId, 'TransactionModel');
  const lastTxn = await Transaction.findOne({ companyId, partyType, partyId, isDeleted: false }).sort({ date: -1, createdAt: -1 });
  return lastTxn ? lastTxn.balance : 0;
};

const createLedgerEntry = async ({ companyId, partyType, partyId, type, referenceId, referenceModel, debit, credit, narration, date, createdBy }) => {
  const Transaction = DatabaseManager.getModel(companyId, 'TransactionModel');
  const prevBalance = await getRunningBalance(companyId, partyType, partyId);
  const balance = prevBalance + (debit || 0) - (credit || 0);
  const txn = await Transaction.create({
    companyId, partyType, partyId, type, referenceId, referenceModel,
    debit: debit || 0, credit: credit || 0, balance, narration, date: date || new Date(), createdBy
  });
  return txn;
};

const getLedger = async (companyId, partyType, partyId, { startDate, endDate, page = 1, limit = 50 } = {}) => {
  const Transaction = DatabaseManager.getModel(companyId, 'TransactionModel');
  const query = { companyId, partyType, partyId, isDeleted: false };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  const total = await Transaction.countDocuments(query);
  const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 })
    .skip((page - 1) * limit).limit(Number(limit));
  return { transactions, total, page: Number(page), limit: Number(limit) };
};

module.exports = { createLedgerEntry, getLedger, getRunningBalance };

