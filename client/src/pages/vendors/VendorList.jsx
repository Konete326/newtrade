import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import FormInput from '../../components/FormInput';
import { validators, inputFilters } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY = { name: '', phone: '', email: '', address: '' };

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const fetchVendors = () => {
    setLoading(true);
    vendorService.getAll().then((res) => setVendors(res.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchVendors(); }, []);

  const set = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (form.phone && validators.phone(form.phone)) newErrors.phone = validators.phone(form.phone);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    try {
      await vendorService.create(form);
      toast.success('Vendor created');
      setShowForm(false);
      setForm({ ...EMPTY });
      fetchVendors();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await vendorService.delete(deleteTarget._id); toast.success('Deleted'); setDeleteTarget(null); fetchVendors(); }
    catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone', render: (val) => val || '-' },
    { key: 'email', label: 'Email', render: (val) => val || '-' },
    { key: 'outstanding', label: 'Outstanding', render: (val) => formatCurrency(val || 0) },
    { key: '_id', label: 'Actions', sortable: false, render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => navigate(`/vendors/${row._id}`)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Eye size={15} /></button>
        <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-50"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Vendors" subtitle="Manage vendor/supplier accounts" actions={[{ label: 'Add Vendor', icon: <Plus size={16} />, onClick: () => setShowForm(true) }]} />
      <DataTable columns={columns} data={vendors} loading={loading} searchPlaceholder="Search vendors..." />
      {showForm && (
        <FormModal title="Add Vendor" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <FormInput label="Name" name="name" value={form.name} onChange={set('name')} required placeholder="e.g. Malik Suppliers" rules={[validators.required]} />
            <FormInput label="Phone" name="phone" value={form.phone} onChange={set('phone')} filter={inputFilters.numbersOnly} placeholder="e.g. 03211234567" rules={[validators.phone]} />
            <FormInput label="Email" name="email" type="email" value={form.email} onChange={set('email')} placeholder="e.g. info@maliksuppliers.com" rules={[validators.email]} />
            <FormInput label="Address" name="address" value={form.address} onChange={set('address')} placeholder="e.g. Grain Market, Lahore" />
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Save Vendor</button>
          </form>
        </FormModal>
      )}
      {deleteTarget && <ConfirmDialog title="Delete Vendor" message={`Delete "${deleteTarget.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { validators } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const fetchVendors = () => {
    setLoading(true);
    vendorService.getAll().then((res) => setVendors(res.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchVendors(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (form.phone && validators.phone(form.phone)) newErrors.phone = validators.phone(form.phone);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    try { await vendorService.create(form); toast.success('Vendor created'); setShowForm(false); setForm({ name: '', phone: '', email: '', address: '' }); fetchVendors(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await vendorService.delete(deleteTarget._id); toast.success('Deleted'); setDeleteTarget(null); fetchVendors(); }
    catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone', render: (val) => val || '-' },
    { key: 'email', label: 'Email', render: (val) => val || '-' },
    { key: 'outstanding', label: 'Outstanding', render: (val) => formatCurrency(val || 0) },
    { key: '_id', label: 'Actions', sortable: false, render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => navigate(`/vendors/${row._id}`)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Eye size={15} /></button>
        <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-50"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Vendors" subtitle="Manage vendor/supplier accounts" actions={[{ label: 'Add Vendor', icon: <Plus size={16} />, onClick: () => setShowForm(true) }]} />
      <DataTable columns={columns} data={vendors} loading={loading} searchPlaceholder="Search vendors..." />
      {showForm && (
        <FormModal title="Add Vendor" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label><input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Malik Suppliers" className={`w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-800 dark:text-gray-200 ${errors.name ? 'border-error-400' : 'border-gray-200 dark:border-gray-700'}`} />{errors.name && <p className="mt-1 text-xs text-error-600">{errors.name}</p>}</div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label><input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="e.g. 03211234567" className={`w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-800 dark:text-gray-200 ${errors.phone ? 'border-error-400' : 'border-gray-200 dark:border-gray-700'}`} />{errors.phone && <p className="mt-1 text-xs text-error-600">{errors.phone}</p>}</div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label><input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="e.g. info@maliksuppliers.com" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label><input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} placeholder="e.g. Grain Market, Lahore" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" /></div>
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Save Vendor</button>
          </form>
        </FormModal>
      )}
      {deleteTarget && <ConfirmDialog title="Delete Vendor" message={`Delete "${deleteTarget.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
