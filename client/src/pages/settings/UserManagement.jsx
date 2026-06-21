import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import FormInput from '../../components/FormInput';
import { validators, inputFilters } from '../../utils/validators';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const EMPTY = { name: '', email: '', password: '', role: 'SALES', phone: '' };

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [errors, setErrors] = useState({});

  const fetchUsers = () => {
    setLoading(true);
    userService.getAll().then((res) => setUsers(res.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const set = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else { const err = validators.email(form.email); if (err) newErrors.email = err; }
    if (!form.password || form.password.length < 6) newErrors.password = 'Min 6 characters';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    try {
      await userService.create(form);
      toast.success('User created');
      setShowForm(false);
      setForm({ ...EMPTY });
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
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
        {row._id !== currentUser?._id ? (
          <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-error-500 hover:bg-error-50"><Trash2 size={15} /></button>
        ) : (
          <span className="px-2 text-xs text-gray-400">—</span>
        )}
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
            <FormInput label="Name" name="name" value={form.name} onChange={set('name')} required placeholder="e.g. Ali Hassan" rules={[validators.required]} />
            <FormInput label="Email" name="email" type="email" value={form.email} onChange={set('email')} required placeholder="e.g. ali@traderdesk.com" rules={[validators.required, validators.email]} />
            <FormInput label="Password" name="password" type="password" value={form.password} onChange={set('password')} required placeholder="Min 6 characters" rules={[validators.required, validators.password]} />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Role" name="role" value={form.role} onChange={set('role')}>
                <option value="SALES">Sales</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
                <option value="VIEWER">Viewer</option>
              </FormInput>
              <FormInput label="Phone" name="phone" value={form.phone} onChange={set('phone')} filter={inputFilters.numbersOnly} placeholder="e.g. 03001234567" rules={[validators.phone]} />
            </div>
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Create User</button>
          </form>
        </FormModal>
      )}
      {deleteTarget && <ConfirmDialog title="Delete User" message={`Delete user "${deleteTarget.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
