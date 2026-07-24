import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  LayoutDashboard,
  Utensils,
  Flame,
  Truck,
  BookOpen,
  Layers,
  Package,
  Grid,
  Calendar,
  CreditCard,
  Users,
  BarChart3,
  QrCode,
  ShieldCheck,
  Settings,
  LogOut,
  UserCheck,
  X
} from 'lucide-react';

export const allNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Cashier', 'Waiter', 'Chef', 'Delivery Partner'] },
  { id: 'dinein', label: 'Dine-In POS', icon: Utensils, badge: 'POS', roles: ['Admin', 'Manager', 'Cashier', 'Waiter'] },
  { id: 'kds', label: 'Kitchen KDS', icon: Flame, badge: 'LIVE', roles: ['Admin', 'Manager', 'Chef'] },
  { id: 'delivery', label: 'Delivery', icon: Truck, roles: ['Admin', 'Manager', 'Cashier', 'Delivery Partner'] },
  { id: 'orders', label: 'Orders Kanban', icon: Utensils, roles: ['Admin', 'Manager', 'Cashier', 'Waiter'] },
  { id: 'menu', label: 'Food Menu', icon: BookOpen, roles: ['Admin', 'Manager', 'Chef'] },
  { id: 'category', label: 'Categories', icon: Layers, roles: ['Admin', 'Manager'] },
  { id: 'inventory', label: 'Inventory', icon: Package, badge: 'ALERT', roles: ['Admin', 'Manager', 'Chef'] },
  { id: 'tables', label: 'Floor Plan', icon: Grid, roles: ['Admin', 'Manager', 'Waiter'] },
  { id: 'reservations', label: 'Reservations', icon: Calendar, roles: ['Admin', 'Manager', 'Waiter'] },
  { id: 'billing', label: 'Billing & Invoices', icon: CreditCard, roles: ['Admin', 'Manager', 'Cashier'] },
  { id: 'staff', label: 'Staff Roster', icon: Users, roles: ['Admin', 'Manager'] },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['Admin', 'Manager'] },
  { id: 'qr-menu', label: 'Customer QR Menu', icon: QrCode, roles: ['Admin', 'Manager', 'Waiter'] },
  { id: 'audit', label: 'Audit Logs', icon: ShieldCheck, roles: ['Admin', 'Manager'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['Admin', 'Manager'] }
];

export default function Sidebar({ activePage, setActivePage, user, onLogout, sidebarOpen, setSidebarOpen }) {
  const { activeRole } = useRestaurant();

  // Filter items based on active role permissions
  const permittedNavItems = allNavItems.filter((item) =>
    item.roles.includes(activeRole || 'Admin')
  );

  const handleNavClick = (id) => {
    setActivePage(id);
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <aside className="w-64 bg-[#1e293b] border-r border-[#334155] flex flex-col justify-between h-full select-none font-sans shadow-xl">
      <div>
        {/* Header */}
        <div className="p-4 border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">Cinder Restaurant</h1>
              <p className="text-[10px] text-[#3b82f6] font-mono mt-0.5 uppercase tracking-wider">{activeRole} Mode</p>
            </div>
          </div>

          {setSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#64748b] hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          <p className="px-3 py-1.5 text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
            MODULE NAVIGATION
          </p>
          {permittedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer font-medium ${
                  isActive
                    ? 'bg-[#3b82f6] text-white font-bold shadow'
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#334155]'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748b]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                      isActive ? 'bg-white text-[#3b82f6]' : 'bg-[#3b82f6]/20 text-[#3b82f6]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-[#334155] space-y-2 bg-[#0f172a]/50">
        {user && (
          <div className="flex items-center space-x-2.5 bg-[#0f172a] p-2 rounded-lg border border-[#334155]">
            <div className="w-7 h-7 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <p className="text-white font-bold truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-[#3b82f6] uppercase truncate">{activeRole}</p>
            </div>
          </div>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full bg-[#0f172a] hover:bg-[#ef4444] text-[#94a3b8] hover:text-white py-1.5 rounded-lg text-xs font-bold border border-[#334155] hover:border-[#ef4444] flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Terminal</span>
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-screen sticky top-0 z-30">
        {sidebarContent}
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full transform transition-transform duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
