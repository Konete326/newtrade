import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saleService } from '../../services/saleService';
import FormInput from '../../components/FormInput';
import PageHeader from '../../components/PageHeader';
import { validators, inputFilters } from '../../utils/validators';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const itemInputClass = 'rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:border-brand-300 focus:ring-brand-500/10';

export default function SaleForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customerId: '', invoiceNo: '', date: '', discount: '', notes: '' });
  const [items, setItems] = useState([{ productId: '', quantity: '', salePrice: '' }]);
  const [errors, setErrors] = useState({});

  const set = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));
  const addItem = () => setItems((p) => [...p, { productId: '', quantity: '', salePrice: '' }]);
  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems((p) => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const filteredItem = (i, field, val, filter) => updateItem(i, field, filter ? filter(val) : val);

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.salePrice) || 0), 0);
  const discount = Number(form.discount) || 0;
  const grandTotal = subtotal - discount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.customerId) newErrors.customerId = 'Customer is required';
    if (!form.invoiceNo) newErrors.invoiceNo = 'Invoice number is required';
    if (items.some((it) => !it.productId || !it.quantity || !it.salePrice)) newErrors.items = 'All items must have product, quantity, and price';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        discount: Number(form.discount) || 0,
        items: items.map((it) => ({ productId: it.productId, quantity: Number(it.quantity), salePrice: Number(it.salePrice) })),
      };
      await saleService.create(payload);
      toast.success('Sale created');
      navigate('/sales');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create sale');
    } finally { setSaving(false); }
  };

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="New Sale" subtitle="Create a sales invoice" backPath="/sales" />
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-black">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Sale Details</h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <FormInput label="Customer ID" name="customerId" value={form.customerId} onChange={set('customerId')} required placeholder="e.g. customer _id" rules={[validators.required]} />
            <FormInput label="Invoice #" name="invoiceNo" value={form.invoiceNo} onChange={set('invoiceNo')} required placeholder="e.g. INV-2024-001" rules={[validators.required]} />
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
                <input value={item.salePrice} onChange={(e) => filteredItem(i, 'salePrice', e.target.value, inputFilters.decimalOnly)} placeholder="Price" className={`w-28 ${itemInputClass}`} />
                <span className="w-28 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Rs. {((Number(item.quantity) || 0) * (Number(item.salePrice) || 0)).toLocaleString()}</span>
                {items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="rounded-lg p-2 text-error-500 hover:bg-error-50"><Trash2 size={15} /></button>}
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal:</span><span className="font-medium text-gray-800 dark:text-gray-200">Rs. {subtotal.toLocaleString()}</span></div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Discount:</span>
              <input value={form.discount} onChange={(e) => set('discount')(inputFilters.decimalOnly(e.target.value))} placeholder="0" className="w-32 rounded-lg border border-gray-200 px-3 py-1.5 text-right text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
            </div>
            <div className="flex justify-between text-base"><span className="font-semibold text-gray-800 dark:text-gray-200">Grand Total:</span><span className="text-lg font-bold text-brand-600 dark:text-brand-400">Rs. {grandTotal.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/sales')} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"><Save size={16} />{saving ? 'Saving...' : 'Create Sale'}</button>
        </div>
      </form>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saleService } from '../../services/saleService';
import PageHeader from '../../components/PageHeader';
import { Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SaleForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customerId: '', invoiceNo: '', date: '', discount: '', notes: '' });
  const [items, setItems] = useState([{ productId: '', quantity: '', salePrice: '' }]);
  const [errors, setErrors] = useState({});

  const addItem = () => setItems((p) => [...p, { productId: '', quantity: '', salePrice: '' }]);
  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems((p) => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.salePrice) || 0), 0);
  const discount = Number(form.discount) || 0;
  const grandTotal = subtotal - discount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.customerId) newErrors.customerId = 'Customer is required';
    if (!form.invoiceNo) newErrors.invoiceNo = 'Invoice number is required';
    if (items.some((it) => !it.productId || !it.quantity || !it.salePrice)) newErrors.items = 'All items must have product, quantity, and price';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        discount: Number(form.discount) || 0,
        items: items.map((it) => ({ productId: it.productId, quantity: Number(it.quantity), salePrice: Number(it.salePrice) })),
      };
      await saleService.create(payload);
      toast.success('Sale created');
      navigate('/sales');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create sale');
    } finally { setSaving(false); }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500 ${
      errors[field] ? 'border-error-400 focus:ring-error-500/10' : 'border-gray-200 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700'
    }`;

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="New Sale" subtitle="Create a sales invoice" backPath="/sales" />
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-black">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Sale Details</h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Customer ID *</label>
              <input value={form.customerId} onChange={(e) => setForm((p) => ({ ...p, customerId: e.target.value }))} placeholder="e.g. customer _id" className={inputClass('customerId')} />
              {errors.customerId && <p className="mt-1 text-xs text-error-600">{errors.customerId}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Invoice # *</label>
              <input value={form.invoiceNo} onChange={(e) => setForm((p) => ({ ...p, invoiceNo: e.target.value }))} placeholder="e.g. INV-2024-001" className={inputClass('invoiceNo')} />
              {errors.invoiceNo && <p className="mt-1 text-xs text-error-600">{errors.invoiceNo}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className={inputClass('date')} />
            </div>
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
                <input value={item.productId} onChange={(e) => updateItem(i, 'productId', e.target.value)} placeholder="Product ID" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                <input value={item.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} placeholder="Qty" className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                <input value={item.salePrice} onChange={(e) => updateItem(i, 'salePrice', e.target.value)} placeholder="Price" className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
                <span className="w-28 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Rs. {((Number(item.quantity) || 0) * (Number(item.salePrice) || 0)).toLocaleString()}</span>
                {items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="rounded-lg p-2 text-error-500 hover:bg-error-50"><Trash2 size={15} /></button>}
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal:</span><span className="font-medium text-gray-800 dark:text-gray-200">Rs. {subtotal.toLocaleString()}</span></div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Discount:</span>
              <input value={form.discount} onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))} placeholder="0" className="w-32 rounded-lg border border-gray-200 px-3 py-1.5 text-right text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
            </div>
            <div className="flex justify-between text-base"><span className="font-semibold text-gray-800 dark:text-gray-200">Grand Total:</span><span className="text-lg font-bold text-brand-600 dark:text-brand-400">Rs. {grandTotal.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/sales')} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"><Save size={16} />{saving ? 'Saving...' : 'Create Sale'}</button>
        </div>
      </form>
    </div>
  );
}
