import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { validators, inputFilters } from '../../utils/validators';
import { useValidation } from '../../hooks/useValidation';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', sku: '', barcode: '', category: '', unit: 'piece',
    purchasePrice: '', salePrice: '', wholesalePrice: '', minStock: '',
    description: '',
  });

  const validationFields = useMemo(() => ({
    name: [validators.required],
    sku: [validators.required, validators.sku],
    barcode: [validators.barcode],
    purchasePrice: [validators.required, validators.positiveNumber],
    salePrice: [validators.required, validators.positiveNumber],
    wholesalePrice: [validators.positiveNumber],
  }), []);

  const { errors, touched, handleChange, handleBlur, validateAll } = useValidation(validationFields);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      productService.getById(id)
        .then((res) => {
          const p = res.data.data;
          setForm({
            name: p.name || '', sku: p.sku || '', barcode: p.barcode || '',
            category: p.category || '', unit: p.unit || 'piece',
            purchasePrice: p.purchasePrice?.toString() || '', salePrice: p.salePrice?.toString() || '',
            wholesalePrice: p.wholesalePrice?.toString() || '', minStock: p.minStock?.toString() || '',
            description: p.description || '',
          });
        })
        .catch(() => toast.error('Failed to load product'))
        .finally(() => setLoading(false));
    } else {
      productService.getNextBarcode()
        .then((res) => setForm((p) => ({ ...p, barcode: res.data.data })))
        .catch(() => {});
    }
  }, [id]);

  const onChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    handleChange(field, value, validationFields[field] || []);
  };

  const onBlur = (field) => {
    handleBlur(field, form[field], validationFields[field] || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validateAll(form);
    if (!valid) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        purchasePrice: Number(form.purchasePrice),
        salePrice: Number(form.salePrice),
        wholesalePrice: form.wholesalePrice ? Number(form.wholesalePrice) : undefined,
        minStock: form.minStock ? Number(form.minStock) : undefined,
      };
      if (isEdit) {
        await productService.update(id, payload);
        toast.success('Product updated successfully');
      } else {
        await productService.create(payload);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-black dark:text-gray-200 dark:placeholder:text-gray-500 ${
      touched[field] && errors[field]
        ? 'border-error-400 focus:border-error-400 focus:ring-error-500/10'
        : 'border-gray-200 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700'
    }`;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title={isEdit ? 'Edit Product' : 'New Product'} subtitle="Fill in product details" backPath="/products" />
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-black">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name *</label>
            <input value={form.name} onChange={(e) => onChange('name', e.target.value)} onBlur={() => onBlur('name')} placeholder="e.g. Basmati Rice 5kg" className={inputClass('name')} />
            {touched.name && errors.name && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">SKU *</label>
            <input value={form.sku} onChange={(e) => onChange('sku', e.target.value)} onBlur={() => onBlur('sku')} placeholder="e.g. RIC-BAS-5KG" className={inputClass('sku')} />
            {touched.sku && errors.sku && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.sku}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Barcode</label>
            <input value={form.barcode} onChange={(e) => onChange('barcode', inputFilters.numbersOnly(e.target.value))} onBlur={() => onBlur('barcode')} placeholder="e.g. 8901234567890" className={inputClass('barcode')} />
            {touched.barcode && errors.barcode && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.barcode}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <input value={form.category} onChange={(e) => onChange('category', e.target.value)} placeholder="e.g. Rice & Grains" className={inputClass('category')} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
            <select value={form.unit} onChange={(e) => onChange('unit', e.target.value)} className={inputClass('unit')}>
              <option value="piece">Piece</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="gram">Gram</option>
              <option value="liter">Liter</option>
              <option value="box">Box</option>
              <option value="bag">Bag</option>
              <option value="carton">Carton</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Price *</label>
            <input value={form.purchasePrice} onChange={(e) => onChange('purchasePrice', inputFilters.decimalOnly(e.target.value))} onBlur={() => onBlur('purchasePrice')} placeholder="e.g. 500" className={inputClass('purchasePrice')} />
            {touched.purchasePrice && errors.purchasePrice && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.purchasePrice}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Sale Price *</label>
            <input value={form.salePrice} onChange={(e) => onChange('salePrice', inputFilters.decimalOnly(e.target.value))} onBlur={() => onBlur('salePrice')} placeholder="e.g. 650" className={inputClass('salePrice')} />
            {touched.salePrice && errors.salePrice && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.salePrice}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Wholesale Price</label>
            <input value={form.wholesalePrice} onChange={(e) => onChange('wholesalePrice', inputFilters.decimalOnly(e.target.value))} onBlur={() => onBlur('wholesalePrice')} placeholder="e.g. 600" className={inputClass('wholesalePrice')} />
            {touched.wholesalePrice && errors.wholesalePrice && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.wholesalePrice}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Min Stock Alert</label>
            <input value={form.minStock} onChange={(e) => onChange('minStock', inputFilters.numbersOnly(e.target.value))} placeholder="e.g. 10" className={inputClass('minStock')} />
          </div>
        </div>
        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea value={form.description} onChange={(e) => onChange('description', e.target.value)} rows={3} placeholder="Product description (optional)" className={inputClass('description')} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/products')} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-600">
            <Save size={16} />
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
