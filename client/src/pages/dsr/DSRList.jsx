import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dsrService } from '../../services/dsrService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function DSRList() {
  const [dsrList, setDsrList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dsrService.getAll().then((res) => setDsrList(res.data.data || [])).catch(() => toast.error('Failed to load DSR')).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: '_id', label: 'DSR #', render: (_, row) => row._id?.slice(-6) },
    { key: 'salesmanName', label: 'Salesman', render: (val) => val || '-' },
    { key: 'totalSales', label: 'Total Sales', render: (val) => formatCurrency(val || 0) },
    { key: 'totalCollections', label: 'Collections', render: (val) => formatCurrency(val || 0) },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'PENDING'} /> },
    { key: 'date', label: 'Date', render: (val) => formatDate(val) },
    { key: '_id', label: 'View', sortable: false, render: (_, row) => (
      <button onClick={() => navigate(`/dsr/${row._id}`)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Eye size={15} /></button>
    )},
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="DSR" subtitle="Daily Sales Reports" />
      <DataTable columns={columns} data={dsrList} loading={loading} searchPlaceholder="Search DSR..." />
    </div>
  );
}
