import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { BarChart3, Download, Calendar, TrendingUp, Award, FileSpreadsheet, FileText, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const hourlyData = [
  { hour: '11:00', orders: 12 },
  { hour: '12:00', orders: 38 },
  { hour: '13:00', orders: 54 },
  { hour: '14:00', orders: 28 },
  { hour: '18:00', orders: 42 },
  { hour: '19:00', orders: 68 },
  { hour: '20:00', orders: 85 },
  { hour: '21:00', orders: 46 }
];

const categoryRevenueData = [
  { name: 'Main Course', value: 42 },
  { name: 'Biryani', value: 24 },
  { name: 'Starters', value: 18 },
  { name: 'Desserts', value: 10 },
  { name: 'Drinks', value: 6 }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function ReportsView() {
  const { orders, foods } = useRestaurant();
  const [reportRange, setReportRange] = useState('Daily');

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Order ID,Type,Customer,Total,Status\n" +
      orders.map(e => `${e.id},${e.type},${e.customerName},${e.totalAmount},${e.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Cinder_Restaurant_Report_${reportRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Header */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Executive Reports & Analytics Suite</h2>
            <p className="text-[#94a3b8]">Daily, weekly, monthly sales reports, kitchen performance & data exports</p>
          </div>
        </div>

        {/* Range Selector & Export */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-[#0f172a] p-1 rounded-lg border border-[#334155]">
            {['Daily', 'Weekly', 'Monthly'].map((r) => (
              <button
                key={r}
                onClick={() => setReportRange(r)}
                className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                  reportRange === r ? 'bg-[#3b82f6] text-white' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg font-bold flex items-center space-x-2 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Orders Bar Chart */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-[#334155] pb-3">
            ORDERS BY HOUR DISTRIBUTION ({reportRange.toUpperCase()})
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut Chart */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-[#334155] pb-3">
            REVENUE SHARE BY CATEGORY (%)
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryRevenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  formatter={(val) => [`${val}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
