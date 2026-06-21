import { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ partyId: '', partyType: 'customer', amount: '', type: 'RECEIVE', method: 'CASH', notes: '' });
  const [errors, setErrors] = useState({});

  const fetchPayments = () => {
    setLoading(true);
    paymentService.getAll().then((res) => setPayments(res.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.partyId) newErrors.partyId = 'Party is required';
    if (!form.amount) newErrors.amount = 'Amount is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    try { await paymentService.create({ ...form, amount: Number(form.amount) }); toast.success('Payment recorded'); setShowForm(false); setForm({ partyId: '', partyType: 'customer', amount: '', type: 'RECEIVE', method: 'CASH', notes: '' }); fetchPayments(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await paymentService.delete(deleteTarget._id); toast.success('Deleted'); setDeleteTarget(null); fetchPayments(); }
    catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { key: '_id', label: 'Ref #', render: (_, row) => row._id?.slice(-6) },
    { key: 'partyName', label: 'Party', render: (val) => val || '-' },
    { key: 'type', label: 'Type', render: (val) => (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${val === 'RECEIVE' ? 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400' : 'bg-warning-100 text-warning-700'}`}>{val || 'RECEIVE'}</span>
    )},
    { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val || 0) },
    { key: 'method', label: 'Method', render: (val) => val || '-' },
    { key: 'createdAt', label: 'Date', render: (val) => formatDate(val) },
    { key: '_id', label: 'Actions', sortable: false, render: (_, row) => (
      <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-50"><Trash2 size={15} /></button>
    )},
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Payments" subtitle="Receive from customers, pay vendors" actions={[{ label: 'Record Payment', icon: <Plus size={16} />, onClick: () => setShowForm(true) }]} />
      <DataTable columns={columns} data={payments} loading={loading} searchPlaceholder="Search payments..." />
      {showForm && (
        <FormModal title="Record Payment" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label><select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"><option value="RECEIVE">Receive (Customer)</option><option value="MAKE">Make (Vendor)</option></select></div>
              <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Method</label><select value={form.method} onChange={(e) => setForm((p) => ({ ...p, method: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"><option value="CASH">Cash</option><option value="BANK">Bank</option><option value="CHEQUE">Cheque</option></select></div>
            </div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Party ID *</label><input value={form.partyId} onChange={(e) => setForm((p) => ({ ...p, partyId: e.target.value }))} placeholder="e.g. customer/vendor _id" className={`w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-800 dark:text-gray-200 ${errors.partyId ? 'border-error-400' : 'border-gray-200 dark:border-gray-700'}`} />{errors.partyId && <p className="mt-1 text-xs text-error-600">{errors.partyId}</p>}</div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount *</label><input value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} placeholder="e.g. 50000" className={`w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-800 dark:text-gray-200 ${errors.amount ? 'border-error-400' : 'border-gray-200 dark:border-gray-700'}`} />{errors.amount && <p className="mt-1 text-xs text-error-600">{errors.amount}</p>}</div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label><input value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Optional notes" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" /></div>
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Record Payment</button>
          </form>
        </FormModal>
      )}
      {deleteTarget && <ConfirmDialog title="Delete Payment" message="Delete this payment record?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
