import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import { Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const [tenants, setTenants] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getTenants(), adminService.getHealth()])
      .then(([tRes, hRes]) => { setTenants(tRes.data.data || []); setHealth(hRes.data.data); })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'name', label: 'Company' },
    { key: 'companyId', label: 'Company ID', render: (val) => val || '-' },
    { key: 'status', label: 'Status', render: (val) => (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${val === 'ACTIVE' ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'}`}>{val || '-'}</span>
    )},
    { key: 'createdAt', label: 'Created', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Admin Panel" subtitle="System administration — SUPER_ADMIN only" />
      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2"><Activity size={18} className="text-success-600" /><span className="text-sm text-gray-500">System Status</span></div>
            <p className="mt-1 text-lg font-bold text-success-600">{health.status || 'Healthy'}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Total Tenants</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{tenants.length}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Version</p>
            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{health.version || '1.0.0'}</p>
          </div>
        </div>
      )}
      <DataTable columns={columns} data={tenants} loading={loading} searchPlaceholder="Search tenants..." />
    </div>
  );
}
