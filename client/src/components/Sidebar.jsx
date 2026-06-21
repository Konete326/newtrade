import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, Warehouse, ShoppingCart, Receipt,
  Monitor, RotateCcw, Truck, ClipboardList, Users, TruckIcon,
  CreditCard, FileText, BarChart3, Settings, Shield, ChevronDown, Store,
} from 'lucide-react';

export default function Sidebar() {
  const { sidebarToggle, setSidebarToggle } = useApp();
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { id: 'products', label: 'Products', path: '/products', icon: Package },
    { id: 'stock', label: 'Stock', path: '/stock', icon: Warehouse },
    {
      id: 'purchases', label: 'Purchases', icon: ShoppingCart,
      children: [
        { label: 'All Purchases', path: '/purchases' },
        { label: 'New Purchase', path: '/purchases/new' },
      ],
    },
    {
      id: 'sales', label: 'Sales', icon: Receipt,
      children: [
        { label: 'All Sales', path: '/sales' },
        { label: 'New Sale', path: '/sales/new' },
      ],
    },
    { id: 'pos', label: 'Quick POS', path: '/pos', icon: Monitor },
    {
      id: 'returns', label: 'Returns', icon: RotateCcw,
      children: [
        { label: 'All Returns', path: '/returns' },
        { label: 'New Return', path: '/returns/new' },
      ],
    },
    {
      id: 'challans', label: 'Challans', icon: Truck,
      children: [
        { label: 'All Challans', path: '/challans' },
        { label: 'New Challan', path: '/challans/new' },
      ],
    },
    { id: 'dsr', label: 'DSR', path: '/dsr', icon: ClipboardList },
    { id: 'customers', label: 'Customers', path: '/customers', icon: Users },
    { id: 'vendors', label: 'Vendors', path: '/vendors', icon: TruckIcon },
    { id: 'payments', label: 'Payments', path: '/payments', icon: CreditCard },
    { id: 'expenses', label: 'Expenses', path: '/expenses', icon: FileText },
    { id: 'reports', label: 'Reports', path: '/reports', icon: BarChart3 },
    {
      id: 'settings', label: 'Settings', icon: Settings,
      children: [
        { label: 'Company', path: '/settings' },
        { label: 'Users', path: '/settings/users' },
        { label: 'Print Templates', path: '/settings/print' },
      ],
    },
  ];

  if (user?.role === 'SUPER_ADMIN') {
    menuItems.push({ id: 'admin', label: 'Admin Panel', path: '/admin', icon: Shield });
  }

  const isActive = (p) => path === p;
  const isGroupActive = (item) => {
    if (item.children) return item.children.some((c) => path === c.path || (c.path !== '/' && path.startsWith(c.path + '/')));
    return path === item.path || (item.path !== '/' && path.startsWith(item.path));
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-[9999] flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0 ${
        sidebarToggle ? 'w-[290px] translate-x-0' : 'w-[290px] -translate-x-full lg:w-[90px] lg:translate-x-0'
      }`}
    >
      <div className={`flex items-center border-b border-gray-200 px-5 py-5 dark:border-gray-800 ${sidebarToggle ? 'justify-between' : 'justify-center lg:justify-center'}`}>
        <Link to="/" className="flex items-center gap-2">
          <Store size={28} className="text-brand-600 dark:text-brand-400" />
          <span className={`text-lg font-bold text-gray-900 dark:text-white ${!sidebarToggle ? 'lg:hidden' : ''}`}>
            Trader Desktop
          </span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <nav>
          <ul className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isGroupActive(item);
              const isExpanded = expanded[item.id];

              if (item.children) {
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => toggle(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon size={20} className={active ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400'} />
                      <span className={`${!sidebarToggle ? 'lg:hidden' : ''} flex-1 text-left`}>{item.label}</span>
                      <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''} ${!sidebarToggle ? 'lg:hidden' : ''}`} />
                    </button>
                    <div className={`overflow-hidden ${isExpanded ? 'block' : 'hidden'}`}>
                      <ul className="ml-5 mt-1 flex flex-col gap-0.5 border-l border-gray-200 pl-4 dark:border-gray-700">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                                isActive(child.path)
                                  ? 'font-medium text-brand-700 dark:text-brand-400'
                                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => { if (window.innerWidth < 1024) setSidebarToggle(false); }}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(item.path) || (item.path !== '/' && path.startsWith(item.path))
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={20} className={isActive(item.path) || (item.path !== '/' && path.startsWith(item.path)) ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400'} />
                    <span className={`${!sidebarToggle ? 'lg:hidden' : ''}`}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
