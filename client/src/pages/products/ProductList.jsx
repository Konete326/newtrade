import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = () => {
    setLoading(true);
    productService.getAll()
      .then((res) => setProducts(res.data.data || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async () => {
    try {
      await productService.delete(deleteTarget._id);
      toast.success('Product deleted successfully');
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'barcode', label: 'Barcode' },
    { key: 'category', label: 'Category', render: (val) => val || '-' },
    { key: 'salePrice', label: 'Sale Price', render: (val) => formatCurrency(val || 0) },
    { key: 'purchasePrice', label: 'Purchase Price', render: (val) => formatCurrency(val || 0) },
    { key: 'stock', label: 'Stock', render: (val) => val ?? 0 },
    {
      key: '_id', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(`/products/${row._id}`)} className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <Edit size={15} />
          </button>
          <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-error-500 transition hover:bg-error-50 dark:hover:bg-error-500/10">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title="Products"
        subtitle="Manage your product inventory"
        actions={[{ label: 'Add Product', icon: <Plus size={16} />, onClick: () => navigate('/products/new') }]}
      />
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        searchPlaceholder="Search products..."
        actions={null}
      />
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
