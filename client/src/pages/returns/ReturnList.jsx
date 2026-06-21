import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { returnService } from '../../services/returnService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ReturnList() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    returnService.getAll().then((res) => setReturns(res.data.data || [])).catch(() => toast.error('Failed to load returns')).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: '_id', label: 'Return #', render: (_, row) => row._id?.slice(-6) },
    { key: 'saleId', label: 'Sale Ref', render: (val) => val || '-' },
    { key: 'reason', label: 'Reason', render: (val) => val || '-' },
    { key: 'totalAmount', label: 'Amount', render: (val) => formatCurrency(val || 0) },
    { key: 'createdAt', label: 'Date', render: (val) => formatDate(val) },
    { key: '_id', label: 'View', sortable: false, render: (_, row) => (
      <button onClick={() => navigate(`/returns/${row._id}`)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Eye size={15} /></button>
    )},
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Returns" subtitle="Manage sale returns" actions={[{ label: 'New Return', icon: <Plus size={16} />, onClick: () => navigate('/returns/new') }]} />
      <DataTable columns={columns} data={returns} loading={loading} searchPlaceholder="Search returns..." />
    </div>
  );
}
