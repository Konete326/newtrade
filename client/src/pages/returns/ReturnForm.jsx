import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { returnService } from '../../services/returnService';
import FormInput from '../../components/FormInput';
import PageHeader from '../../components/PageHeader';
import { validators, inputFilters } from '../../utils/validators';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const itemInputClass = 'rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-black dark:text-gray-200 focus:outline-none focus:ring-2 focus:border-brand-300 focus:ring-brand-500/10';

export default function ReturnForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ saleId: '', reason: '' });
  const [items, setItems] = useState([{ productId: '', quantity: '', price: '' }]);
  const [errors, setErrors] = useState({});

  const set = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));
  const addItem = () => setItems((p) => [...p, { productId: '', quantity: '', price: '' }]);
  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems((p) => p.map((it, idx) => idx === i ? { ...it, [field]: val } : it));
  const filteredItem = (i, field, val, filter) => updateItem(i, field, filter ? filter(val) : val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.saleId) newErrors.saleId = 'Sale ID is required';
    if (items.some((it) => !it.productId || !it.quantity)) newErrors.items = 'Product and quantity required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    setSaving(true);
    try {
      await returnService.create({ ...form, items: items.map((it) => ({ productId: it.productId, quantity: Number(it.quantity), price: Number(it.price) || 0 })) });
      toast.success('Return created');
      navigate('/returns');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="New Return" subtitle="Record a sale return" backPath="/returns" />
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-black">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput label="Sale ID" name="saleId" value={form.saleId} onChange={set('saleId')} required placeholder="e.g. sale _id" rules={[validators.required]} />
            <FormInput label="Reason" name="reason" value={form.reason} onChange={set('reason')} placeholder="e.g. Damaged product" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-black">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Return Items</h3>
            <button type="button" onClick={addItem} className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400"><Plus size={14} /> Add</button>
          </div>
          {errors.items && <p className="mb-3 text-xs text-error-600">{errors.items}</p>}
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <input value={item.productId} onChange={(e) => updateItem(i, 'productId', e.target.value)} placeholder="Product ID" className={`flex-1 ${itemInputClass}`} />
                <input value={item.quantity} onChange={(e) => filteredItem(i, 'quantity', e.target.value, inputFilters.decimalOnly)} placeholder="Qty" className={`w-24 ${itemInputClass}`} />
                <input value={item.price} onChange={(e) => filteredItem(i, 'price', e.target.value, inputFilters.decimalOnly)} placeholder="Price" className={`w-28 ${itemInputClass}`} />
                {items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="p-2 text-error-500"><Trash2 size={15} /></button>}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/returns')} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"><Save size={16} />{saving ? 'Saving...' : 'Create Return'}</button>
        </div>
      </form>
    </div>
  );
}
