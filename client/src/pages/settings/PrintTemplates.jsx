import PageHeader from '../../components/PageHeader';

export default function PrintTemplates() {
  return (
    <div className="p-4 lg:p-6">
      <PageHeader title="Print Templates" subtitle="Customize invoice and challan print layouts" />
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">Print template editor coming soon. Templates will be configurable from this page.</p>
      </div>
    </div>
  );
}
