import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ companyName: '', phone: '', email: '', address: '', taxId: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { toast.success('Settings saved'); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Company Settings" subtitle="Manage your company information" />
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-black">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label><input value={form.companyName} onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))} placeholder="e.g. Trader Desktop Pvt Ltd" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label><input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="e.g. 02112345678" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label><input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="e.g. info@traderdesk.com" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tax ID / NTN</label><input value={form.taxId} onChange={(e) => setForm((p) => ({ ...p, taxId: e.target.value }))} placeholder="e.g. 1234567-8" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" /></div>
        </div>
        <div className="mt-5"><label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label><textarea value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} rows={2} placeholder="e.g. Shop 5, Main Bazaar, Karachi" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" /></div>
        <div className="mt-6 flex justify-end"><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"><Save size={16} />{saving ? 'Saving...' : 'Save Settings'}</button></div>
      </form>
    </div>
  );
}
