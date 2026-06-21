import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dsrService } from '../../services/dsrService';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { toast } from 'sonner';

export default function DSRDetail() {
  const { id } = useParams();
  const [dsr, setDsr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dsrService.getById(id).then((res) => setDsr(res.data.data)).catch(() => toast.error('Failed to load DSR')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!dsr) return <div className="p-6 text-center text-gray-500">DSR not found</div>;

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title={`DSR #${id?.slice(-6)}`} subtitle={`Salesman: ${dsr.salesmanName || '-'}`} backPath="/dsr" />
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-black">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Sales</p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(dsr.totalSales || 0)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-black">
            <p className="text-xs text-gray-500 dark:text-gray-400">Collections</p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(dsr.totalCollections || 0)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-black">
            <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{formatDate(dsr.date)}</p>
          </div>
        </div>
        {dsr.entries?.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-black">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Entries</h3>
            <table className="w-full">
              <thead><tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Customer</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Sale</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Collection</th>
              </tr></thead>
              <tbody>
                {dsr.entries.map((entry, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50">
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{entry.customerName || '-'}</td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{formatCurrency(entry.saleAmount || 0)}</td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{formatCurrency(entry.collection || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
