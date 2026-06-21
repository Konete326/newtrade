import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { vendorService } from '../../services/vendorService';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { toast } from 'sonner';

export default function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([vendorService.getById(id), vendorService.getLedger(id)])
      .then(([vRes, lRes]) => { setVendor(vRes.data.data); setLedger(lRes.data.data || []); })
      .catch(() => toast.error('Failed'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!vendor) return <div className="p-6 text-center text-gray-500">Vendor not found</div>;

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title={vendor.name} subtitle={`Vendor — ${vendor.phone || 'No phone'}`} backPath="/vendors" />
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black"><p className="text-xs text-gray-500">Email</p><p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">{vendor.email || '-'}</p></div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black"><p className="text-xs text-gray-500">Phone</p><p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">{vendor.phone || '-'}</p></div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black"><p className="text-xs text-gray-500">Address</p><p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">{vendor.address || '-'}</p></div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black"><p className="text-xs text-gray-500">Outstanding</p><p className="mt-1 text-sm font-bold text-error-600">{formatCurrency(vendor.outstanding || 0)}</p></div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-black">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Ledger (Khata)</h3>
          {ledger.length > 0 ? (
            <table className="w-full"><thead><tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Date</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Type</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Debit</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Credit</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">Balance</th>
            </tr></thead><tbody>
              {ledger.map((entry, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50">
                  <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{formatDate(entry.date)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{entry.type || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{entry.debit ? formatCurrency(entry.debit) : '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{entry.credit ? formatCurrency(entry.credit) : '-'}</td>
                  <td className="px-3 py-2 text-sm font-medium text-gray-800 dark:text-gray-200">{formatCurrency(entry.balance || 0)}</td>
                </tr>
              ))}
            </tbody></table>
          ) : <p className="py-8 text-center text-sm text-gray-400">No ledger entries</p>}
        </div>
      </div>
    </div>
  );
}
