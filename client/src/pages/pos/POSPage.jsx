import { useState } from 'react';
import { saleService } from '../../services/saleService';
import PageHeader from '../../components/PageHeader';
import { ShoppingCart, Plus, Trash2, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner';

export default function POSPage() {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ productId: '', name: '', quantity: '', price: '' }]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [saving, setSaving] = useState(false);

  const addItem = () => setItems((p) => [...p, { productId: '', name: '', quantity: '', price: '' }]);
  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems((p) => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const subtotal = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);

  const handleCheckout = async () => {
    if (!customerId) return toast.error('Customer ID is required');
    if (items.some((it) => !it.productId || !it.quantity || !it.price)) return toast.error('Fill all item fields');
    setSaving(true);
    try {
      await saleService.create({
        customerId,
        invoiceNo: `POS-${Date.now()}`,
        paymentMethod,
        paymentStatus: 'PAID',
        items: items.map((it) => ({ productId: it.productId, quantity: Number(it.quantity), salePrice: Number(it.price) })),
      });
      toast.success('Sale completed');
      setItems([{ productId: '', name: '', quantity: '', price: '' }]);
      setCustomerId('');
    } catch (err) { toast.error(err.response?.data?.message || 'Checkout failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Quick POS" subtitle="Fast point-of-sale checkout" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-black">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Items</h3>
              <button onClick={addItem} className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400"><Plus size={14} /> Add</button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={item.productId} onChange={(e) => updateItem(i, 'productId', e.target.value)} placeholder="Product ID" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                  <input value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} placeholder="Qty" className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                  <input value={item.price} onChange={(e) => updateItem(i, 'price', e.target.value)} placeholder="Price" className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                  <span className="w-24 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Rs. {((Number(item.quantity) || 0) * (Number(item.price) || 0)).toLocaleString()}</span>
                  {items.length > 1 && <button onClick={() => removeItem(i)} className="p-1.5 text-error-500 hover:bg-error-50"><Trash2 size={14} /></button>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-black">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Checkout</h3>
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Customer ID</label>
            <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="e.g. customer _id" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPaymentMethod('CASH')} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${paymentMethod === 'CASH' ? 'bg-brand-600 text-white' : 'border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300'}`}><Banknote size={16} /> Cash</button>
              <button onClick={() => setPaymentMethod('CREDIT')} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${paymentMethod === 'CREDIT' ? 'bg-brand-600 text-white' : 'border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300'}`}><CreditCard size={16} /> Credit</button>
            </div>
          </div>
          <div className="mb-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="flex justify-between text-sm text-gray-500"><span>Items:</span><span>{items.filter((it) => it.productId).length}</span></div>
            <div className="mt-2 flex justify-between text-lg font-bold text-gray-900 dark:text-white"><span>Total:</span><span>Rs. {subtotal.toLocaleString()}</span></div>
          </div>
          <button onClick={handleCheckout} disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-success-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-success-700 disabled:opacity-60">
            <ShoppingCart size={18} />
            {saving ? 'Processing...' : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}
