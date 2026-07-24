import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

import DashboardView from './views/DashboardView';
import DineInView from './views/DineInView';
import KDSView from './views/KDSView';
import DeliveryView from './views/DeliveryView';
import OrdersView from './views/OrdersView';
import MenuView from './views/MenuView';
import CategoryView from './views/CategoryView';
import InventoryView from './views/InventoryView';
import TablesView from './views/TablesView';
import ReservationsView from './views/ReservationsView';
import BillingView from './views/BillingView';
import StaffView from './views/StaffView';
import ReportsView from './views/ReportsView';
import CustomerQRMenuView from './views/CustomerQRMenuView';
import AuditLogView from './views/AuditLogView';
import SettingsView from './views/SettingsView';

export default function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView searchQuery={searchQuery} />;
      case 'dinein':
        return <DineInView />;
      case 'kds':
        return <KDSView />;
      case 'delivery':
        return <DeliveryView />;
      case 'orders':
        return <OrdersView searchQuery={searchQuery} />;
      case 'menu':
        return <MenuView searchQuery={searchQuery} />;
      case 'category':
        return <CategoryView />;
      case 'inventory':
        return <InventoryView />;
      case 'tables':
        return <TablesView searchQuery={searchQuery} />;
      case 'reservations':
        return <ReservationsView />;
      case 'billing':
        return <BillingView />;
      case 'staff':
        return <StaffView searchQuery={searchQuery} />;
      case 'reports':
        return <ReportsView />;
      case 'qr-menu':
        return <CustomerQRMenuView />;
      case 'audit':
        return <AuditLogView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex font-sans selection:bg-[#3b82f6] selection:text-white">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <TopBar
          activePage={activePage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSidebarOpen={setSidebarOpen}
          setActivePage={setActivePage}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
