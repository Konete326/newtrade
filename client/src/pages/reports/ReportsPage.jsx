import { useState } from 'react';
import { reportService } from '../../services/reportService';
import PageHeader from '../../components/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import { BarChart3, TrendingUp, Package, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('sales');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReport = async (type) => {
    setActiveTab(type);
    setLoading(true);
    try {
      const fn = { sales: reportService.sales, stock: reportService.stock, expenses: reportService.expenses, profitLoss: reportService.profitLoss }[type];
      const res = await fn({});
      setData(res.data.data);
    } catch { toast.error('Failed to load report'); }
    finally { setLoading(false); }
  };

  const tabs = [
    { id: 'sales', label: 'Sales Report', icon: BarChart3 },
    { id: 'stock', label: 'Stock Report', icon: Package },
    { id: 'expenses', label: 'Expense Report', icon: FileText },
    { id: 'profitLoss', label: 'Profit & Loss', icon: TrendingUp },
  ];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Reports" subtitle="Business analytics and reports" />
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => loadReport(tab.id)} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${activeTab === tab.id ? 'bg-brand-600 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
              <Icon size={16} />{tab.label}
            </button>
          );
        })}
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-black">
        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" /></div>
        ) : data ? (
          <div>
            {Array.isArray(data) && data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full"><thead><tr className="border-b border-gray-200 dark:border-gray-800">
                  {Object.keys(data[0]).map((key) => (<th key={key} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{key}</th>))}
                </tr></thead><tbody>
                  {data.map((row, i) => (<tr key={i} className="border-b border-gray-100 dark:border-gray-800/50">
                    {Object.values(row).map((val, j) => (<td key={j} className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300">{typeof val === 'number' ? formatCurrency(val) : String(val ?? '-')}</td>))}
                  </tr>))}
                </tbody></table>
              </div>
            ) : typeof data === 'object' && !Array.isArray(data) ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {Object.entries(data).map(([key, val]) => (
                  <div key={key} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-xs text-gray-500">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{typeof val === 'number' ? formatCurrency(val) : String(val ?? '-')}</p>
                  </div>
                ))}
              </div>
            ) : <p className="py-10 text-center text-sm text-gray-400">No data available. Select a report tab above.</p>}
          </div>
        ) : <p className="py-10 text-center text-sm text-gray-400">Select a report tab to view data</p>}
      </div>
    </div>
  );
}
