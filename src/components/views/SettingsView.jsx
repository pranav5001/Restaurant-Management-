import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Tag, Globe, Clock, Percent, ShieldCheck } from 'lucide-react';

export default function SettingsView() {
  const [openingHours, setOpeningHours] = useState('11:00 AM - 11:00 PM');
  const [taxRate, setTaxRate] = useState(5.0);
  const [couponCode, setCouponCode] = useState('WELCOME10');
  const [couponDiscount, setCouponDiscount] = useState(10);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg('Settings saved successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Restaurant Settings & Configuration</h2>
            <p className="text-[#94a3b8]">Configure operating hours, GST tax rates, coupon discounts, and data backups</p>
          </div>
        </div>
      </div>

      {savedMsg && (
        <div className="bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] p-3 rounded-xl font-bold text-xs">
          ✓ {savedMsg}
        </div>
      )}

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
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
}
