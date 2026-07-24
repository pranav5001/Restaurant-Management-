import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Search, Bell, Clock, Menu, Sun, Moon, QrCode, Shield, Utensils } from 'lucide-react';

const pageTitles = {
  dashboard: 'Executive Dashboard',
  dinein: 'Dine-In Management POS',
  kds: 'Kitchen Display System (KDS)',
  delivery: 'Delivery Order Dispatch & Tracking',
  orders: 'Orders Kanban Board',
  menu: 'Food Menu Management',
  category: 'Food Category Management',
  inventory: 'Inventory & Stock Management',
  tables: 'Visual Table Layout',
  reservations: 'Table Reservation System',
  billing: 'Billing & Invoice System',
  staff: 'Staff Roster & Duty',
  reports: 'Analytics & Reports',
  'qr-menu': 'Customer Digital QR Menu',
  audit: 'Security Audit Logs',
  settings: 'Restaurant Settings'
};

export default function TopBar({ activePage, searchQuery, setSearchQuery, setSidebarOpen, setActivePage }) {
  const { activeRole, setActiveRole, themeMode, toggleTheme, notifications } = useRestaurant();
  const [currentTime, setCurrentTime] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const roles = ['Admin', 'Manager', 'Cashier', 'Waiter', 'Chef', 'Delivery Partner'];

  return (
    <header className="bg-[#1e293b] border-b border-[#334155] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-md font-sans text-xs">
      {/* Left Title */}
      <div className="flex items-center space-x-3 min-w-0">
        {setSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#f8fafc] hover:text-[#3b82f6] p-1.5 rounded-lg bg-[#0f172a] border border-[#334155] cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-none truncate">
            {pageTitles[activePage] || 'Dashboard'}
          </h2>
          <p className="text-[11px] text-[#94a3b8] mt-0.5 hidden sm:block">
            Cinder Restaurant Management OS
          </p>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-xs sm:max-w-md relative">
        <Search className="w-4 h-4 absolute left-3 top-2 text-[#64748b]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders, dishes, tables, staff..."
          className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] text-white text-xs rounded-lg pl-9 pr-3 py-1.5 outline-none transition-all placeholder:text-[#475569]"
        />
      </div>

      {/* Right Controls (Role Switcher, QR Code, Dark/Light Mode, Notifications) */}
      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
        {/* Role Switcher */}
        <div className="hidden md:flex items-center space-x-1.5 bg-[#0f172a] px-2.5 py-1 rounded-lg border border-[#334155]">
          <Shield className="w-3.5 h-3.5 text-[#3b82f6]" />
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value)}
            className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r} value={r} className="bg-[#1e293b] text-white">
                Role: {r}
              </option>
            ))}
          </select>
        </div>

        {/* Customer QR Menu Button */}
        {setActivePage && (
          <button
            onClick={() => setActivePage('qr-menu')}
            className="hidden sm:flex items-center space-x-1 bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-[#3b82f6] px-2.5 py-1.5 rounded-lg border border-[#3b82f6]/30 font-bold cursor-pointer transition-colors"
            title="Customer Digital QR Menu"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden lg:inline">QR Menu</span>
          </button>
        )}

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#334155] border border-[#334155] text-[#f8fafc] cursor-pointer transition-colors"
          title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>

        {/* Live Clock */}
        <div className="hidden xl:flex items-center space-x-1.5 bg-[#0f172a] px-3 py-1.5 rounded-lg border border-[#334155]">
          <Clock className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span className="font-mono text-xs text-[#f8fafc]">{currentTime || '19:42:05'}</span>
        </div>

        {/* Notifications Flyout */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="w-8 h-8 rounded-lg bg-[#0f172a] hover:bg-[#334155] border border-[#334155] flex items-center justify-center text-[#f8fafc] hover:text-[#3b82f6] transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef4444] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl p-3 z-50 space-y-2">
              <div className="flex items-center justify-between border-b border-[#334155] pb-2 px-1">
                <span className="font-bold text-white">Live System Alerts</span>
                <span className="text-[10px] text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded font-mono font-bold">
                  {notifications.length} Alerts
                </span>
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-[#0f172a] border border-[#334155] text-[#f8fafc]">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-[#3b82f6]">{n.title}</p>
                      <span className="text-[10px] text-[#94a3b8]">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-gray-300 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
