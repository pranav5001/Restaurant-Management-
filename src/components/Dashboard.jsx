import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

import DashboardView from './views/DashboardView';
import OrdersView from './views/OrdersView';
import MenuView from './views/MenuView';
import TablesView from './views/TablesView';
import StaffView from './views/StaffView';
import ReportsView from './views/ReportsView';

export default function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView searchQuery={searchQuery} />;
      case 'orders':
        return <OrdersView searchQuery={searchQuery} />;
      case 'menu':
        return <MenuView searchQuery={searchQuery} />;
      case 'tables':
        return <TablesView searchQuery={searchQuery} />;
      case 'staff':
        return <StaffView searchQuery={searchQuery} />;
      case 'reports':
        return <ReportsView searchQuery={searchQuery} />;
      default:
        return <DashboardView searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#e6e4df] flex font-body selection:bg-[#ff4d25] selection:text-white">
      {/* Responsive Navigation Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <TopBar
          activePage={activePage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Dynamic Page Content View */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
