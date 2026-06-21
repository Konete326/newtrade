import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { challanService } from '../../services/challanService';
import PageHeader from '../../components/PageHeader';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ChallanForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customerId: '', deliveryAddress: '', notes: '' });
  const [items, setItems] = useState([{ productId: '', quantity: '' }]);
  const [errors, setErrors] = useState({});

  const addItem = () => setItems((p) => [...p, { productId: '', quantity: '' }]);
  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems((p) => p.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.customerId) newErrors.customerId = 'Customer is required';
    if (items.some((it) => !it.productId || !it.quantity)) newErrors.items = 'Product and quantity required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    setSaving(true);
    try {
      await challanService.create({ ...form, items: items.map((it) => ({ productId: it.productId, quantity: Number(it.quantity) })) });
      toast.success('Challan created');
      navigate('/challans');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="New Challan" subtitle="Create delivery challan" backPath="/challans" />
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Customer ID *</label>
              <input value={form.customerId} onChange={(e) => setForm((p) => ({ ...p, customerId: e.target.value }))} placeholder="e.g. customer _id" className={`w-full rounded-lg border px-4 py-2.5 text-sm dark:bg-gray-800 dark:text-gray-200 ${errors.customerId ? 'border-error-400' : 'border-gray-200 dark:border-gray-700'}`} />
              {errors.customerId && <p className="mt-1 text-xs text-error-600">{errors.customerId}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Address</label>
              <input value={form.deliveryAddress} onChange={(e) => setForm((p) => ({ ...p, deliveryAddress: e.target.value }))} placeholder="e.g. Shop 12, Market Area" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Items</h3>
            <button type="button" onClick={addItem} className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400"><Plus size={14} /> Add</button>
          </div>
          {errors.items && <p className="mb-3 text-xs text-error-600">{errors.items}</p>}
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <input value={item.productId} onChange={(e) => updateItem(i, 'productId', e.target.value)} placeholder="Product ID" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                <input value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} placeholder="Qty" className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                {items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="p-2 text-error-500"><Trash2 size={15} /></button>}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/challans')} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"><Save size={16} />{saving ? 'Saving...' : 'Create Challan'}</button>
        </div>
      </form>
    </div>
  );
}
