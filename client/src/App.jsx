import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import LoadingSpinner from './components/LoadingSpinner';

const MainLayout = lazy(() => import('./layouts/MainLayout'));
const Login = lazy(() => import('./pages/auth/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProductList = lazy(() => import('./pages/products/ProductList'));
const ProductForm = lazy(() => import('./pages/products/ProductForm'));
const StockOverview = lazy(() => import('./pages/stock/StockOverview'));
const PurchaseList = lazy(() => import('./pages/purchases/PurchaseList'));
const PurchaseForm = lazy(() => import('./pages/purchases/PurchaseForm'));
const SaleList = lazy(() => import('./pages/sales/SaleList'));
const SaleForm = lazy(() => import('./pages/sales/SaleForm'));
const POSPage = lazy(() => import('./pages/pos/POSPage'));
const ReturnList = lazy(() => import('./pages/returns/ReturnList'));
const ReturnForm = lazy(() => import('./pages/returns/ReturnForm'));
const ChallanList = lazy(() => import('./pages/challans/ChallanList'));
const ChallanForm = lazy(() => import('./pages/challans/ChallanForm'));
const DSRList = lazy(() => import('./pages/dsr/DSRList'));
const DSRDetail = lazy(() => import('./pages/dsr/DSRDetail'));
const CustomerList = lazy(() => import('./pages/customers/CustomerList'));
const CustomerDetail = lazy(() => import('./pages/customers/CustomerDetail'));
const VendorList = lazy(() => import('./pages/vendors/VendorList'));
const VendorDetail = lazy(() => import('./pages/vendors/VendorDetail'));
const PaymentList = lazy(() => import('./pages/payments/PaymentList'));
const ExpenseList = lazy(() => import('./pages/expenses/ExpenseList'));
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));
const UserManagement = lazy(() => import('./pages/settings/UserManagement'));
const PrintTemplates = lazy(() => import('./pages/settings/PrintTemplates'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ProtectedRoutes() {
  return (
    <Routes>
      <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id" element={<ProductForm />} />
        <Route path="/stock" element={<StockOverview />} />
        <Route path="/purchases" element={<PurchaseList />} />
        <Route path="/purchases/new" element={<PurchaseForm />} />
        <Route path="/purchases/:id" element={<PurchaseForm />} />
        <Route path="/sales" element={<SaleList />} />
        <Route path="/sales/new" element={<SaleForm />} />
        <Route path="/sales/:id" element={<SaleForm />} />
        <Route path="/pos" element={<POSPage />} />
        <Route path="/returns" element={<ReturnList />} />
        <Route path="/returns/new" element={<ReturnForm />} />
        <Route path="/returns/:id" element={<ReturnForm />} />
        <Route path="/challans" element={<ChallanList />} />
        <Route path="/challans/new" element={<ChallanForm />} />
        <Route path="/challans/:id" element={<ChallanForm />} />
        <Route path="/dsr" element={<DSRList />} />
        <Route path="/dsr/:id" element={<DSRDetail />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/vendors" element={<VendorList />} />
        <Route path="/vendors/:id" element={<VendorDetail />} />
        <Route path="/payments" element={<PaymentList />} />
        <Route path="/expenses" element={<ExpenseList />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/users" element={<UserManagement />} />
        <Route path="/settings/print" element={<PrintTemplates />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/*" element={<ProtectedRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
