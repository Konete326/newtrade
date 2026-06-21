import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseService } from '../../services/purchaseService';
import FormInput from '../../components/FormInput';
import PageHeader from '../../components/PageHeader';
import { validators, inputFilters } from '../../utils/validators';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const itemInputClass = 'rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:border-brand-300 focus:ring-brand-500/10';

export default function PurchaseForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ vendorId: '', invoiceNo: '', date: '', notes: '' });
  const [items, setItems] = useState([{ productId: '', quantity: '', purchasePrice: '' }]);
  const [errors, setErrors] = useState({});

  const set = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));
  const addItem = () => setItems((p) => [...p, { productId: '', quantity: '', purchasePrice: '' }]);
  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems((p) => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const filteredItem = (i, field, val, filter) => updateItem(i, field, filter ? filter(val) : val);

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

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="New Purchase" subtitle="Record a purchase order with landed cost" backPath="/purchases" />
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-black">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Purchase Details</h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <FormInput label="Vendor ID" name="vendorId" value={form.vendorId} onChange={set('vendorId')} required placeholder="e.g. vendor _id" rules={[validators.required]} />
            <FormInput label="Invoice #" name="invoiceNo" value={form.invoiceNo} onChange={set('invoiceNo')} required placeholder="e.g. PO-2024-001" rules={[validators.required]} />
            <FormInput label="Date" name="date" type="date" value={form.date} onChange={set('date')} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-black">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Items</h3>
            <button type="button" onClick={addItem} className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400"><Plus size={14} /> Add Item</button>
          </div>
          {errors.items && <p className="mb-3 text-xs text-error-600">{errors.items}</p>}
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <input value={item.productId} onChange={(e) => updateItem(i, 'productId', e.target.value)} placeholder="Product ID" className={`flex-1 ${itemInputClass}`} />
                <input value={item.quantity} onChange={(e) => filteredItem(i, 'quantity', e.target.value, inputFilters.decimalOnly)} placeholder="Qty" className={`w-24 ${itemInputClass}`} />
                <input value={item.purchasePrice} onChange={(e) => filteredItem(i, 'purchasePrice', e.target.value, inputFilters.decimalOnly)} placeholder="Price" className={`w-28 ${itemInputClass}`} />
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
