import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import FormInput from '../../components/FormInput';
import { validators, inputFilters } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY = { name: '', phone: '', email: '', address: '', type: 'WHOLESALER' };

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const fetchCustomers = () => {
    setLoading(true);
    customerService.getAll().then((res) => setCustomers(res.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCustomers(); }, []);

  const set = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (form.phone && validators.phone(form.phone)) newErrors.phone = validators.phone(form.phone);
    if (form.email && validators.email(form.email)) newErrors.email = validators.email(form.email);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    try {
      await customerService.create(form);
      toast.success('Customer created');
      setShowForm(false);
      setForm({ ...EMPTY });
      fetchCustomers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await customerService.delete(deleteTarget._id); toast.success('Deleted'); setDeleteTarget(null); fetchCustomers(); }
    catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone', render: (val) => val || '-' },
    { key: 'email', label: 'Email', render: (val) => val || '-' },
    { key: 'type', label: 'Type', render: (val) => val || '-' },
    { key: 'outstanding', label: 'Outstanding', render: (val) => formatCurrency(val || 0) },
    {
      key: '_id', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(`/customers/${row._id}`)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Eye size={15} /></button>
          <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-50"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Customers" subtitle="Manage customer accounts and ledgers" actions={[{ label: 'Add Customer', icon: <Plus size={16} />, onClick: () => setShowForm(true) }]} />
      <DataTable columns={columns} data={customers} loading={loading} searchPlaceholder="Search customers..." />

      {showForm && (
        <FormModal title="Add Customer" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <FormInput label="Name" name="name" value={form.name} onChange={set('name')} required placeholder="e.g. Ahmed Traders" rules={[validators.required]} />
            <FormInput label="Phone" name="phone" value={form.phone} onChange={set('phone')} filter={inputFilters.numbersOnly} placeholder="e.g. 03001234567" rules={[validators.phone]} />
            <FormInput label="Email" name="email" type="email" value={form.email} onChange={set('email')} placeholder="e.g. info@ahmedtraders.com" rules={[validators.email]} />
            <FormInput label="Type" name="type" value={form.type} onChange={set('type')}>
              <option value="WHOLESALER">Wholesaler</option>
              <option value="RETAILER">Retailer</option>
              <option value="CUSTOM">Custom</option>
            </FormInput>
            <FormInput label="Address" name="address" value={form.address} onChange={set('address')} placeholder="e.g. Jodia Bazar, Karachi" />
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Save Customer</button>
          </form>
        </FormModal>
      )}

      {deleteTarget && <ConfirmDialog title="Delete Customer" message={`Delete "${deleteTarget.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
