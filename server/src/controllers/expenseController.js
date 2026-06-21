const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const DatabaseManager = require('../services/DatabaseManager');
const { uploadToCloudinary } = require('../config/cloudinary');

const generateExpenseNumber = async (Expense, companyId) => {
  const count = await Expense.countDocuments({ companyId });
  return `EXP-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
};

const getExpenses = asyncHandler(async (req, res) => {
  const Expense = DatabaseManager.getModel(req.companyId, 'ExpenseModel');
  const { page = 1, limit = 20, category, approvalStatus } = req.query;
  const query = { companyId: req.companyId, isDeleted: false };
  if (category) query.category = category;
  if (approvalStatus) query.approvalStatus = approvalStatus;
  const total = await Expense.countDocuments(query);
  const expenses = await Expense.find(query).populate('incurredBy', 'name email').populate('approvedBy', 'name email')
    .skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ success: true, message: 'Expenses fetched', data: expenses, meta: { page: Number(page), limit: Number(limit), total } });
});

const getExpenseById = asyncHandler(async (req, res) => {
  const Expense = DatabaseManager.getModel(req.companyId, 'ExpenseModel');
  const expense = await Expense.findOne({ _id: req.params.id, companyId: req.companyId, isDeleted: false })
    .populate('incurredBy', 'name email').populate('approvedBy', 'name email');
  if (!expense) throw new AppError('Expense not found.', 404);
  res.json({ success: true, message: 'Expense fetched', data: expense });
});

const createExpense = asyncHandler(async (req, res) => {
  const Expense = DatabaseManager.getModel(req.companyId, 'ExpenseModel');
  const expenseNumber = await generateExpenseNumber(Expense, req.companyId);
  const attachments = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, `trader-desktop/expenses/${req.companyId}`);
      attachments.push({ url: result.secure_url, publicId: result.public_id, name: file.originalname });
    }
  }
  const expense = await Expense.create({
    ...req.body, companyId: req.companyId, expenseNumber, incurredBy: req.user.userId, attachments
  });
  res.status(201).json({ success: true, message: 'Expense submitted for approval', data: expense });
});

const approveExpense = asyncHandler(async (req, res) => {
  const Expense = DatabaseManager.getModel(req.companyId, 'ExpenseModel');
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false, approvalStatus: 'PENDING' },
    { approvalStatus: 'APPROVED', approvedBy: req.user.userId, approvedAt: new Date(), lastModifiedAt: new Date() },
    { new: true }
  );
  if (!expense) throw new AppError('Expense not found or already processed.', 404);
  res.json({ success: true, message: 'Expense approved', data: expense });
});

const rejectExpense = asyncHandler(async (req, res) => {
  const Expense = DatabaseManager.getModel(req.companyId, 'ExpenseModel');
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false, approvalStatus: 'PENDING' },
    { approvalStatus: 'REJECTED', approvedBy: req.user.userId, approvedAt: new Date(), rejectionNote: req.body.rejectionNote || '', lastModifiedAt: new Date() },
    { new: true }
  );
  if (!expense) throw new AppError('Expense not found or already processed.', 404);
  res.json({ success: true, message: 'Expense rejected', data: expense });
});

const deleteExpense = asyncHandler(async (req, res) => {
  const Expense = DatabaseManager.getModel(req.companyId, 'ExpenseModel');
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId, isDeleted: false },
    { isDeleted: true, lastModifiedAt: new Date() }, { new: true }
  );
  if (!expense) throw new AppError('Expense not found.', 404);
  res.json({ success: true, message: 'Expense deleted', data: null });
});

module.exports = { getExpenses, getExpenseById, createExpense, approveExpense, rejectExpense, deleteExpense };

