import { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import FormInput from '../../components/FormInput';
import { validators, inputFilters } from '../../utils/validators';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY = { partyId: '', partyType: 'customer', amount: '', type: 'RECEIVE', method: 'CASH', notes: '' };

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [errors, setErrors] = useState({});

  const fetchPayments = () => {
    setLoading(true);
    paymentService.getAll().then((res) => setPayments(res.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayments(); }, []);

  const set = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.partyId) newErrors.partyId = 'Party is required';
    if (!form.amount) newErrors.amount = 'Amount is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    try {
      await paymentService.create({ ...form, amount: Number(form.amount) });
      toast.success('Payment recorded');
      setShowForm(false);
      setForm({ ...EMPTY });
      fetchPayments();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
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
              <FormInput label="Type" name="type" value={form.type} onChange={set('type')}>
                <option value="RECEIVE">Receive (Customer)</option>
                <option value="MAKE">Make (Vendor)</option>
              </FormInput>
              <FormInput label="Method" name="method" value={form.method} onChange={set('method')}>
                <option value="CASH">Cash</option>
                <option value="BANK">Bank</option>
                <option value="CHEQUE">Cheque</option>
              </FormInput>
            </div>
            <FormInput label="Party ID" name="partyId" value={form.partyId} onChange={set('partyId')} required placeholder="e.g. customer/vendor _id" rules={[validators.required]} />
            <FormInput label="Amount" name="amount" value={form.amount} onChange={set('amount')} filter={inputFilters.decimalOnly} required placeholder="e.g. 50000" rules={[validators.required, validators.positiveNumber]} />
            <FormInput label="Notes" name="notes" value={form.notes} onChange={set('notes')} placeholder="Optional notes" />
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Record Payment</button>
          </form>
        </FormModal>
      )}
      {deleteTarget && <ConfirmDialog title="Delete Payment" message="Delete this payment record?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
