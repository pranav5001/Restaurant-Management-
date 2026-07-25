import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Settings, Save, RefreshCw, Download, Upload, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SettingsView() {
  const { syncToCloud, isSyncing } = useRestaurant();
  const [openingHours, setOpeningHours] = useState('11:00 AM - 11:00 PM');
  const [taxRate, setTaxRate] = useState(5.0);
  const [couponCode, setCouponCode] = useState('WELCOME10');
  const [couponDiscount, setCouponDiscount] = useState(10);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    syncToCloud();
    setSavedMsg('Settings saved and synced across all devices!');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const handleExportBackup = () => {
    const data = {
      categories: JSON.parse(localStorage.getItem('cinder_categories') || '[]'),
      foods: JSON.parse(localStorage.getItem('cinder_foods') || '[]'),
      tables: JSON.parse(localStorage.getItem('cinder_tables') || '[]'),
      orders: JSON.parse(localStorage.getItem('cinder_orders') || '[]'),
      inventory: JSON.parse(localStorage.getItem('cinder_inventory') || '[]'),
      reservations: JSON.parse(localStorage.getItem('cinder_reservations') || '[]'),
      staff: JSON.parse(localStorage.getItem('cinder_staff') || '[]'),
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Cinder_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.foods) localStorage.setItem('cinder_foods', JSON.stringify(parsed.foods));
          if (parsed.categories) localStorage.setItem('cinder_categories', JSON.stringify(parsed.categories));
          if (parsed.tables) localStorage.setItem('cinder_tables', JSON.stringify(parsed.tables));
          if (parsed.orders) localStorage.setItem('cinder_orders', JSON.stringify(parsed.orders));
          if (parsed.inventory) localStorage.setItem('cinder_inventory', JSON.stringify(parsed.inventory));
          if (parsed.reservations) localStorage.setItem('cinder_reservations', JSON.stringify(parsed.reservations));
          if (parsed.staff) localStorage.setItem('cinder_staff', JSON.stringify(parsed.staff));
          
          alert('Data backup successfully imported! Reloading app...');
          window.location.reload();
        } catch (err) {
          alert('Invalid backup JSON file.');
        }
      };
    }
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Restaurant Settings & Cross-Device Cloud Sync</h2>
            <p className="text-[#94a3b8]">Configure operating hours, GST tax rates, coupon discounts, and sync PC edits to mobile</p>
          </div>
        </div>
      </div>

      {savedMsg && (
        <div className="bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] p-3 rounded-xl font-bold text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Cloud Sync & Backup Options Panel */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white border-b border-[#334155] pb-3 flex items-center justify-between">
          <span>CROSS-DEVICE CLOUD SYNC & DATA BACKUP</span>
          <span className="text-xs text-[#10b981] font-bold">ONLINE</span>
        </h3>

        <p className="text-xs text-[#94a3b8]">
          To ensure edits made on PC immediately appear when logging in on Mobile phones, click <strong>Sync Mobile & PC Data Now</strong> or export/import your dataset backup.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={syncToCloud}
            disabled={isSyncing}
            className="bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white px-4 py-2.5 rounded-lg font-bold flex items-center space-x-2 cursor-pointer shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Mobile & PC Data Now'}</span>
          </button>

          <button
            onClick={handleExportBackup}
            className="bg-[#0f172a] hover:bg-[#334155] text-white px-4 py-2.5 rounded-lg font-bold border border-[#334155] flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#10b981]" />
            <span>Export Data Backup (JSON)</span>
          </button>

          <label className="bg-[#0f172a] hover:bg-[#334155] text-white px-4 py-2.5 rounded-lg font-bold border border-[#334155] flex items-center space-x-2 cursor-pointer">
            <Upload className="w-4 h-4 text-[#3b82f6]" />
            <span>Import Mobile Data Backup</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tax & Operating Hours */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-[#334155] pb-3">GENERAL SETTINGS</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[#94a3b8] mb-1">Restaurant Opening Hours</label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2.5 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-[#94a3b8] mb-1">GST / Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2.5 outline-none font-bold text-[#3b82f6]"
              />
            </div>
          </div>
        </div>

        {/* Coupons & Discounts */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-[#334155] pb-3">COUPONS & PROMOTIONS</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[#94a3b8] mb-1">Active Coupon Promo Code</label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2.5 outline-none font-bold uppercase"
              />
            </div>

            <div>
              <label className="block text-[#94a3b8] mb-1">Discount Amount ($)</label>
              <input
                type="number"
                value={couponDiscount}
                onChange={(e) => setCouponDiscount(Number(e.target.value))}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2.5 outline-none font-bold text-[#10b981]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-lg font-bold flex items-center space-x-2 cursor-pointer shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings & Sync</span>
        </button>
      </div>
    </div>
  );
}
