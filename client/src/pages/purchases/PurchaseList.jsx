import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseService } from '../../services/purchaseService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const fetchPurchases = () => {
    setLoading(true);
    purchaseService.getAll()
      .then((res) => setPurchases(res.data.data || []))
      .catch(() => toast.error('Failed to load purchases'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPurchases(); }, []);

  const handleDelete = async () => {
    try {
      await purchaseService.delete(deleteTarget._id);
      toast.success('Purchase deleted');
      setDeleteTarget(null);
      fetchPurchases();
    } catch { toast.error('Failed to delete purchase'); }
  };

  const columns = [
    { key: 'invoiceNo', label: 'Invoice #', render: (val, row) => val || row._id?.slice(-6) },
    { key: 'vendorName', label: 'Vendor', render: (val) => val || '-' },
    { key: 'grandTotal', label: 'Total', render: (val) => formatCurrency(val || 0) },
    { key: 'itemCount', label: 'Items', render: (val) => val ?? 0 },
    { key: 'createdAt', label: 'Date', render: (val) => formatDate(val) },
    {
      key: '_id', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(`/purchases/${row._id}`)} className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Eye size={15} /></button>
          <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-error-500 transition hover:bg-error-50 dark:hover:bg-error-500/10"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Purchases" subtitle="Track and manage purchase orders" actions={[{ label: 'New Purchase', icon: <Plus size={16} />, onClick: () => navigate('/purchases/new') }]} />
      <DataTable columns={columns} data={purchases} loading={loading} searchPlaceholder="Search purchases..." />
      {deleteTarget && (
        <ConfirmDialog title="Delete Purchase" message={`Delete purchase #${deleteTarget.invoiceNo || deleteTarget._id?.slice(-6)}?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
