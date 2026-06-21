import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseService } from '../../services/purchaseService';
import { vendorService } from '../../services/vendorService';
import { productService } from '../../services/productService';
import { validators } from '../../utils/validators';
import PageHeader from '../../components/PageHeader';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PurchaseForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ vendorId: '', invoiceNo: '', date: '', notes: '' });
  const [items, setItems] = useState([{ productId: '', quantity: '', purchasePrice: '' }]);
  const [errors, setErrors] = useState({});

  const addItem = () => setItems((p) => [...p, { productId: '', quantity: '', purchasePrice: '' }]);
  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems((p) => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const total = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.purchasePrice) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.vendorId) newErrors.vendorId = 'Vendor is required';
    if (!form.invoiceNo) newErrors.invoiceNo = 'Invoice number is required';
    if (items.some((it) => !it.productId || !it.quantity || !it.purchasePrice)) newErrors.items = 'All items must have product, quantity, and price';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        items: items.map((it) => ({ productId: it.productId, quantity: Number(it.quantity), purchasePrice: Number(it.purchasePrice) })),
      };
      await purchaseService.create(payload);
      toast.success('Purchase created');
      navigate('/purchases');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create purchase');
    } finally { setSaving(false); }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500 ${
      errors[field] ? 'border-error-400 focus:ring-error-500/10' : 'border-gray-200 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700'
    }`;

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="New Purchase" subtitle="Record a purchase order with landed cost" backPath="/purchases" />
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Purchase Details</h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Vendor ID *</label>
              <input value={form.vendorId} onChange={(e) => setForm((p) => ({ ...p, vendorId: e.target.value }))} placeholder="e.g. vendor _id" className={inputClass('vendorId')} />
              {errors.vendorId && <p className="mt-1 text-xs text-error-600">{errors.vendorId}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Invoice # *</label>
              <input value={form.invoiceNo} onChange={(e) => setForm((p) => ({ ...p, invoiceNo: e.target.value }))} placeholder="e.g. PO-2024-001" className={inputClass('invoiceNo')} />
              {errors.invoiceNo && <p className="mt-1 text-xs text-error-600">{errors.invoiceNo}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className={inputClass('date')} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Items</h3>
            <button type="button" onClick={addItem} className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400"><Plus size={14} /> Add Item</button>
          </div>
          {errors.items && <p className="mb-3 text-xs text-error-600">{errors.items}</p>}
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <input value={item.productId} onChange={(e) => updateItem(i, 'productId', e.target.value)} placeholder="Product ID" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                <input value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} placeholder="Qty" className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                <input value={item.purchasePrice} onChange={(e) => updateItem(i, 'purchasePrice', e.target.value)} placeholder="Price" className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)} className="rounded-lg p-2 text-error-500 hover:bg-error-50"><Trash2 size={15} /></button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 text-right dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total: </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Rs. {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/purchases')} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"><Save size={16} />{saving ? 'Saving...' : 'Create Purchase'}</button>
        </div>
      </form>
    </div>
  );
}
