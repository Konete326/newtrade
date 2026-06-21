import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { validators } from '../../utils/validators';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'SALES', phone: '' });
  const [errors, setErrors] = useState({});

  const fetchUsers = () => {
    setLoading(true);
    userService.getAll().then((res) => setUsers(res.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else { const err = validators.email(form.email); if (err) newErrors.email = err; }
    if (!form.password || form.password.length < 6) newErrors.password = 'Min 6 characters';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    try { await userService.create(form); toast.success('User created'); setShowForm(false); setForm({ name: '', email: '', password: '', role: 'SALES', phone: '' }); fetchUsers(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    try { await userService.delete(deleteTarget._id); toast.success('Deleted'); setDeleteTarget(null); fetchUsers(); }
    catch { toast.error('Failed'); }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (val) => <span className="inline-flex rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">{val || '-'}</span> },
    { key: 'phone', label: 'Phone', render: (val) => val || '-' },
    { key: 'isActive', label: 'Status', render: (val) => <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${val !== false ? 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400' : 'bg-error-100 text-error-700'}`}>{val !== false ? 'Active' : 'Inactive'}</span> },
    { key: '_id', label: 'Actions', sortable: false, render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-50"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="User Management" subtitle="Manage system users and roles" actions={[{ label: 'Add User', icon: <Plus size={16} />, onClick: () => setShowForm(true) }]} />
      <DataTable columns={columns} data={users} loading={loading} searchPlaceholder="Search users..." />
      {showForm && (
        <FormModal title="Add User" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label><input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Ali Hassan" className={`w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-800 dark:text-gray-200 ${errors.name ? 'border-error-400' : 'border-gray-200 dark:border-gray-700'}`} />{errors.name && <p className="mt-1 text-xs text-error-600">{errors.name}</p>}</div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label><input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="e.g. ali@traderdesk.com" className={`w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-800 dark:text-gray-200 ${errors.email ? 'border-error-400' : 'border-gray-200 dark:border-gray-700'}`} />{errors.email && <p className="mt-1 text-xs text-error-600">{errors.email}</p>}</div>
            <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Password *</label><input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" className={`w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-800 dark:text-gray-200 ${errors.password ? 'border-error-400' : 'border-gray-200 dark:border-gray-700'}`} />{errors.password && <p className="mt-1 text-xs text-error-600">{errors.password}</p>}</div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label><select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"><option value="SALES">Sales</option><option value="MANAGER">Manager</option><option value="ADMIN">Admin</option><option value="VIEWER">Viewer</option></select></div>
              <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label><input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="e.g. 03001234567" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" /></div>
            </div>
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Create User</button>
          </form>
        </FormModal>
      )}
      {deleteTarget && <ConfirmDialog title="Delete User" message={`Delete user "${deleteTarget.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
