import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../services/reportService';
import { formatCurrency } from '../utils/formatters';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingCart, Receipt, Package, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    reportService.sales({ period: '30d' })
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner />;

  const kpis = [
    { label: 'Total Sales', value: formatCurrency(data?.totalSales || 0), icon: Receipt, color: 'brand' },
    { label: 'Cash Sales', value: formatCurrency(data?.cashSales || 0), icon: ShoppingCart, color: 'success' },
    { label: 'Products', value: data?.productCount || 0, icon: Package, color: 'warning' },
    { label: 'Outstanding', value: formatCurrency(data?.outstanding || 0), icon: TrendingUp, color: 'error' },
  ];

  const recentSales = data?.recentSales || [];
  const monthlyData = data?.monthly || [];
  const topProducts = data?.topProducts || [];

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Dashboard" subtitle="Welcome to Trader Desktop — Wholesale ERP Overview" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-black">
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-${kpi.color}-100 dark:bg-${kpi.color}-500/15`}>
                  <Icon size={20} className={`text-${kpi.color}-600 dark:text-${kpi.color}-400`} />
                </div>
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{kpi.label === 'Total Sales' ? `${data?.transactionCount || 0} txns` : ''}</span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-black">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Monthly Sales</h3>
          <div style={{ height: 256, width: '100%' }}>
            {mounted && (
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-black">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Sales Trend</h3>
          <div style={{ height: 256, width: '100%' }}>
            {mounted && (
              <ResponsiveContainer width="100%" height={256}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="col-span-1 rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-black">
          <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">Top Products</h3>
          {topProducts.length > 0 ? (
            <div style={{ height: 224, width: '100%' }}>
              {mounted && (
                <ResponsiveContainer width="100%" height={224}>
                  <PieChart>
                    <Pie data={topProducts} dataKey="quantity" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {topProducts.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">No data available</p>
          )}
        </div>

        <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-black">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Recent Sales</h3>
            <button onClick={() => navigate('/sales')} className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">View All</button>
          </div>
          {recentSales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Invoice</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Customer</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Amount</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale) => (
                    <tr key={sale._id} className="border-b border-gray-100 dark:border-gray-800/50">
                      <td className="px-3 py-2.5 text-sm font-medium text-gray-800 dark:text-gray-200">#{sale.invoiceNo || sale._id?.slice(-6)}</td>
                      <td className="px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400">{sale.customerName || '-'}</td>
                      <td className="px-3 py-2.5 text-sm font-medium text-gray-800 dark:text-gray-200">{formatCurrency(sale.grandTotal || 0)}</td>
                      <td className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">{new Date(sale.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">No recent sales found</p>
          )}
        </div>
      </div>
    </div>
  );
}
