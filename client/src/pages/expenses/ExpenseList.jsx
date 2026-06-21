import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import FormInput from '../../components/FormInput';
import { validators, inputFilters } from '../../utils/validators';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, Check, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY = { category: '', amount: '', description: '', date: '' };

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [errors, setErrors] = useState({});

  const fetchExpenses = () => {
    setLoading(true);
    expenseService.getAll().then((res) => setExpenses(res.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchExpenses(); }, []);

  const set = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.amount) newErrors.amount = 'Amount is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    try {
      await expenseService.create({ ...form, amount: Number(form.amount) });
      toast.success('Expense created');
      setShowForm(false);
      setForm({ ...EMPTY });
      fetchExpenses();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleApprove = async (id) => { try { await expenseService.approve(id); toast.success('Approved'); fetchExpenses(); } catch { toast.error('Failed'); } };
  const handleReject = async (id) => { try { await expenseService.reject(id, {}); toast.success('Rejected'); fetchExpenses(); } catch { toast.error('Failed'); } };
  const handleDelete = async () => { try { await expenseService.delete(deleteTarget._id); toast.success('Deleted'); setDeleteTarget(null); fetchExpenses(); } catch { toast.error('Failed'); } };

  const columns = [
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val || 0) },
    { key: 'description', label: 'Description', render: (val) => val || '-' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'PENDING'} /> },
    { key: 'createdAt', label: 'Date', render: (val) => formatDate(val) },
    { key: '_id', label: 'Actions', sortable: false, render: (_, row) => (
      <div className="flex items-center gap-1">
        {row.status === 'PENDING' && (<><button onClick={() => handleApprove(row._id)} className="rounded-lg p-1.5 text-success-600 hover:bg-success-50"><Check size={15} /></button><button onClick={() => handleReject(row._id)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-50"><X size={15} /></button></>)}
        <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-50"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Expenses" subtitle="Track and approve business expenses" actions={[{ label: 'Add Expense', icon: <Plus size={16} />, onClick: () => setShowForm(true) }]} />
      <DataTable columns={columns} data={expenses} loading={loading} searchPlaceholder="Search expenses..." />
      {showForm && (
        <FormModal title="Add Expense" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <FormInput label="Category" name="category" value={form.category} onChange={set('category')} required placeholder="e.g. Transportation" rules={[validators.required]} />
            <FormInput label="Amount" name="amount" value={form.amount} onChange={set('amount')} filter={inputFilters.decimalOnly} required placeholder="e.g. 5000" rules={[validators.required, validators.positiveNumber]} />
            <FormInput label="Description" name="description" value={form.description} onChange={set('description')} placeholder="e.g. Fuel for delivery" />
            <FormInput label="Date" name="date" type="date" value={form.date} onChange={set('date')} />
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Save Expense</button>
          </form>
        </FormModal>
      )}
      {deleteTarget && <ConfirmDialog title="Delete Expense" message="Delete this expense?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, Check, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ category: '', amount: '', description: '', date: '' });
  const [errors, setErrors] = useState({});

  const fetchExpenses = () => {
    setLoading(true);
    expenseService.getAll().then((res) => setExpenses(res.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.amount) newErrors.amount = 'Amount is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    try { await expenseService.create({ ...form, amount: Number(form.amount) }); toast.success('Expense created'); setShowForm(false); setForm({ category: '', amount: '', description: '', date: '' }); fetchExpenses(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleApprove = async (id) => { try { await expenseService.approve(id); toast.success('Approved'); fetchExpenses(); } catch { toast.error('Failed'); } };
  const handleReject = async (id) => { try { await expenseService.reject(id, {}); toast.success('Rejected'); fetchExpenses(); } catch { toast.error('Failed'); } };
  const handleDelete = async () => { try { await expenseService.delete(deleteTarget._id); toast.success('Deleted'); setDeleteTarget(null); fetchExpenses(); } catch { toast.error('Failed'); } };

  const columns = [
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val || 0) },
    { key: 'description', label: 'Description', render: (val) => val || '-' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'PENDING'} /> },
    { key: 'createdAt', label: 'Date', render: (val) => formatDate(val) },
    { key: '_id', label: 'Actions', sortable: false, render: (_, row) => (
      <div className="flex items-center gap-1">
        {row.status === 'PENDING' && (<><button onClick={() => handleApprove(row._id)} className="rounded-lg p-1.5 text-success-600 hover:bg-success-50"><Check size={15} /></button><button onClick={() => handleReject(row._id)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-50"><X size={15} /></button></>)}
        <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-50"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Expenses" subtitle="Track and approve business expenses" actions={[{ label: 'Add Expense', icon: <Plus size={16} />, onClick: () => setShowForm(true) }]} />
      <DataTable columns={columns} data={expenses} loading={loading} searchPlaceholder="Search expenses..." />
      {showForm && (
        <FormModal title="Add Expense" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label><input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. Transportation" className={`w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-800 dark:text-gray-200 ${errors.category ? 'border-error-400' : 'border-gray-200 dark:border-gray-700'}`} />{errors.category && <p className="mt-1 text-xs text-error-600">{errors.category}</p>}</div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount *</label><input value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} placeholder="e.g. 5000" className={`w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-800 dark:text-gray-200 ${errors.amount ? 'border-error-400' : 'border-gray-200 dark:border-gray-700'}`} />{errors.amount && <p className="mt-1 text-xs text-error-600">{errors.amount}</p>}</div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label><input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="e.g. Fuel for delivery" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label><input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" /></div>
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Save Expense</button>
          </form>
        </FormModal>
      )}
      {deleteTarget && <ConfirmDialog title="Delete Expense" message="Delete this expense?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
