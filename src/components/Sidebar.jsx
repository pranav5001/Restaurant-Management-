import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  Grid,
  Users,
  BarChart3,
  LogOut,
  Utensils,
  UserCheck,
  X
} from 'lucide-react';

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: UtensilsCrossed, badge: '4' },
  { id: 'menu', label: 'Menu Catalog', icon: BookOpen },
  { id: 'tables', label: 'Floor Plan', icon: Grid },
  { id: 'staff', label: 'Staff Roster', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar({ activePage, setActivePage, user, onLogout, sidebarOpen, setSidebarOpen }) {
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
        <div className="p-5 border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Restaurant App</h1>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">Management OS</p>
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
        <nav className="p-3 space-y-1">
          <p className="px-3 py-2 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
            Menu Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs transition-all cursor-pointer font-medium ${
                  isActive
                    ? 'bg-[#3b82f6] text-white font-semibold shadow'
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#334155]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748b]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
      <div className="p-4 border-t border-[#334155] space-y-3 bg-[#0f172a]/50">
        {user && (
          <div className="flex items-center space-x-3 bg-[#0f172a] p-2.5 rounded-lg border border-[#334155]">
            <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <p className="text-white font-semibold truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-[#3b82f6] font-medium uppercase truncate">{user.role || 'STAFF'}</p>
            </div>
          </div>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full bg-[#0f172a] hover:bg-[#ef4444] text-[#94a3b8] hover:text-white py-2 rounded-lg text-xs font-semibold border border-[#334155] hover:border-[#ef4444] flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
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
