import { useState, useEffect } from 'react';
import { stockService } from '../../services/stockService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'sonner';
import { ArrowRightLeft, Sliders } from 'lucide-react';

export default function StockOverview() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [adjustForm, setAdjustForm] = useState({ productId: '', quantity: '', reason: '' });
  const [transferForm, setTransferForm] = useState({ productId: '', fromLocation: '', toLocation: '', quantity: '' });

  const fetchStock = () => {
    setLoading(true);
    stockService.getAll()
      .then((res) => setStock(res.data.data || []))
      .catch(() => toast.error('Failed to load stock'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStock(); }, []);

  const handleAdjust = async (e) => {
    e.preventDefault();
    try {
      await stockService.adjust({ ...adjustForm, quantity: Number(adjustForm.quantity) });
      toast.success('Stock adjusted');
      setModalType(null);
      setAdjustForm({ productId: '', quantity: '', reason: '' });
      fetchStock();
    } catch { toast.error('Failed to adjust stock'); }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await stockService.transfer({ ...transferForm, quantity: Number(transferForm.quantity) });
      toast.success('Stock transferred');
      setModalType(null);
      fetchStock();
    } catch { toast.error('Failed to transfer stock'); }
  };

  const columns = [
    { key: 'productName', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'currentStock', label: 'Current Stock', render: (val) => val ?? 0 },
    { key: 'minStock', label: 'Min Stock', render: (val) => val ?? 0 },
    { key: 'location', label: 'Location', render: (val) => val || 'Main' },
    { key: 'value', label: 'Stock Value', render: (val) => formatCurrency(val || 0) },
    {
      key: 'status', label: 'Status',
      render: (_, row) => {
        const low = row.minStock && row.currentStock <= row.minStock;
        return (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${low ? 'bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400' : 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400'}`}>
            {low ? 'Low Stock' : 'In Stock'}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Stock Overview" subtitle="Monitor and manage inventory levels" actions={[
        { label: 'Adjust Stock', icon: <Sliders size={16} />, onClick: () => setModalType('adjust') },
        { label: 'Transfer', icon: <ArrowRightLeft size={16} />, onClick: () => setModalType('transfer'), variant: 'outline' },
      ]} />
      <DataTable columns={columns} data={stock} loading={loading} searchPlaceholder="Search stock..." />

      {modalType === 'adjust' && (
        <FormModal title="Adjust Stock" onClose={() => setModalType(null)}>
          <form onSubmit={handleAdjust} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Product ID</label>
              <input value={adjustForm.productId} onChange={(e) => setAdjustForm((p) => ({ ...p, productId: e.target.value }))} placeholder="e.g. product _id" className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700 dark:text-gray-200" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity (+/-)</label>
              <input value={adjustForm.quantity} onChange={(e) => setAdjustForm((p) => ({ ...p, quantity: e.target.value }))} placeholder="e.g. 50 or -10" className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700 dark:text-gray-200" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
              <input value={adjustForm.reason} onChange={(e) => setAdjustForm((p) => ({ ...p, reason: e.target.value }))} placeholder="e.g. Damaged goods" className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700 dark:text-gray-200" />
            </div>
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Adjust</button>
          </form>
        </FormModal>
      )}

      {modalType === 'transfer' && (
        <FormModal title="Transfer Stock" onClose={() => setModalType(null)}>
          <form onSubmit={handleTransfer} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Product ID</label>
              <input value={transferForm.productId} onChange={(e) => setTransferForm((p) => ({ ...p, productId: e.target.value }))} placeholder="e.g. product _id" className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700 dark:text-gray-200" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
                <input value={transferForm.fromLocation} onChange={(e) => setTransferForm((p) => ({ ...p, fromLocation: e.target.value }))} placeholder="e.g. Warehouse A" className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700 dark:text-gray-200" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
                <input value={transferForm.toLocation} onChange={(e) => setTransferForm((p) => ({ ...p, toLocation: e.target.value }))} placeholder="e.g. Shop Floor" className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700 dark:text-gray-200" required />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
              <input value={transferForm.quantity} onChange={(e) => setTransferForm((p) => ({ ...p, quantity: e.target.value }))} placeholder="e.g. 25" className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm dark:border-gray-700 dark:text-gray-200" required />
            </div>
            <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Transfer</button>
          </form>
        </FormModal>
      )}
    </div>
  );
}
