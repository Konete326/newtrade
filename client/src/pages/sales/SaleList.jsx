import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saleService } from '../../services/saleService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function SaleList() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const fetchSales = () => {
    setLoading(true);
    saleService.getAll()
      .then((res) => setSales(res.data.data || []))
      .catch(() => toast.error('Failed to load sales'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSales(); }, []);

  const handleDelete = async () => {
    try {
      await saleService.delete(deleteTarget._id);
      toast.success('Sale deleted');
      setDeleteTarget(null);
      fetchSales();
    } catch { toast.error('Failed to delete sale'); }
  };

  const columns = [
    { key: 'invoiceNo', label: 'Invoice #', render: (val, row) => val || row._id?.slice(-6) },
    { key: 'customerName', label: 'Customer', render: (val) => val || '-' },
    { key: 'grandTotal', label: 'Total', render: (val) => formatCurrency(val || 0) },
    { key: 'paymentStatus', label: 'Payment', render: (val) => (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${val === 'PAID' ? 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400' : 'bg-warning-100 text-warning-700'}`}>{val || 'PENDING'}</span>
    )},
    { key: 'createdAt', label: 'Date', render: (val) => formatDate(val) },
    {
      key: '_id', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(`/sales/${row._id}`)} className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Eye size={15} /></button>
          <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-error-500 transition hover:bg-error-50 dark:hover:bg-error-500/10"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Sales" subtitle="Track sales invoices and payments" actions={[{ label: 'New Sale', icon: <Plus size={16} />, onClick: () => navigate('/sales/new') }]} />
      <DataTable columns={columns} data={sales} loading={loading} searchPlaceholder="Search sales..." />
      {deleteTarget && <ConfirmDialog title="Delete Sale" message={`Delete sale #${deleteTarget.invoiceNo || deleteTarget._id?.slice(-6)}?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
