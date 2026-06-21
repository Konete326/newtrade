import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { challanService } from '../../services/challanService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ChallanList() {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    challanService.getAll().then((res) => setChallans(res.data.data || [])).catch(() => toast.error('Failed to load challans')).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: '_id', label: 'Challan #', render: (_, row) => row._id?.slice(-6) },
    { key: 'customerName', label: 'Customer', render: (val) => val || '-' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'PENDING'} /> },
    { key: 'createdAt', label: 'Date', render: (val) => formatDate(val) },
    { key: '_id', label: 'Actions', sortable: false, render: (_, row) => (
      <button onClick={() => navigate(`/challans/${row._id}`)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Eye size={15} /></button>
    )},
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Challans" subtitle="Delivery challan management" actions={[{ label: 'New Challan', icon: <Plus size={16} />, onClick: () => navigate('/challans/new') }]} />
      <DataTable columns={columns} data={challans} loading={loading} searchPlaceholder="Search challans..." />
    </div>
  );
}
