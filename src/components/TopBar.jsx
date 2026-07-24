import React, { useState, useEffect } from 'react';
import { Search, Bell, Clock, Menu } from 'lucide-react';

const pageTitles = {
  dashboard: 'Executive Dashboard',
  orders: 'Orders Kanban Board',
  menu: 'Menu Item Catalog',
  tables: 'Floor Plan & Tables',
  staff: 'Staff Roster & Duty',
  reports: 'Analytics & Reports'
};

export default function TopBar({ activePage, searchQuery, setSearchQuery, setSidebarOpen }) {
  const [currentTime, setCurrentTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const notifications = [
    { id: 1, text: 'Table #04 Ribeye order fire alert (+18m)', type: 'rust' },
    { id: 2, text: 'Grill Station near 85% capacity load', type: 'turmeric' },
    { id: 3, text: 'Table #02 smash burger marked ready', type: 'herb' }
  ];

  return (
    <header className="bg-[#1e293b] border-b border-[#334155] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-sm font-sans">
      {/* Left Title */}
      <div className="flex items-center space-x-3 min-w-0">
        {setSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#f8fafc] hover:text-[#3b82f6] p-1.5 rounded-lg bg-[#0f172a] border border-[#334155] cursor-pointer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none truncate">
            {pageTitles[activePage] || 'Dashboard'}
          </h2>
          <p className="text-xs text-[#94a3b8] mt-0.5 hidden sm:block">
            Restaurant Management Overview
          </p>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-xs sm:max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748b]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tickets, table #, dish..."
          className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] text-white text-xs rounded-lg pl-9 pr-3 sm:pr-4 py-2 outline-none transition-all placeholder:text-[#475569]"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        {/* Live Clock */}
        <div className="hidden md:flex items-center space-x-2 bg-[#0f172a] px-3 py-1.5 rounded-lg border border-[#334155]">
          <Clock className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span className="font-mono text-xs text-[#f8fafc]">{currentTime || '19:42:05'}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0f172a] hover:bg-[#334155] border border-[#334155] flex items-center justify-center text-[#f8fafc] hover:text-[#3b82f6] transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#3b82f6] text-white font-mono text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl p-3 z-50 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-[#334155] pb-2 px-1">
                <span className="font-semibold text-white">System Alerts</span>
                <span className="text-[10px] text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded font-mono font-bold">3 Live</span>
              </div>
              <div className="space-y-1.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-lg bg-[#0f172a] border border-[#334155] text-[#f8fafc]"
                  >
                    <p className="text-xs leading-snug">{n.text}</p>
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
