import React from 'react';
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp
} from 'lucide-react';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Orders-by-Hour Data for Bar Chart
const hourlyOrdersData = [
  { hour: '16:00', orders: 14, sales: 1250 },
  { hour: '17:00', orders: 28, sales: 2400 },
  { hour: '18:00', orders: 46, sales: 4100 },
  { hour: '19:00', orders: 72, sales: 6850 },
  { hour: '20:00', orders: 61, sales: 5900 },
  { hour: '21:00', orders: 40, sales: 3800 },
  { hour: '22:00', orders: 22, sales: 2100 },
  { hour: '23:00', orders: 10, sales: 850 },
];

// Revenue-by-Category Data for Donut Chart
const revenueByCategoryData = [
  { name: 'Grill Station', value: 11970, color: '#ff4d25' },      // Ember Red-Orange
  { name: 'Saute Station', value: 6650, color: '#ff9800' },       // Turmeric Gold
  { name: 'Starters & Raw Bar', value: 3990, color: '#4caf50' },  // Herb Green
  { name: 'Pantry & Sides', value: 2660, color: '#ffb74d' },      // Amber
  { name: 'Desserts & Spirits', value: 1330, color: '#26a69a' },  // Teal
];

export default function ReportsView() {
  return (
    <div className="space-y-6 font-body">
      {/* Top Overview KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 shadow-md">
          <p className="text-xs text-[#a09a8e] uppercase">TOTAL SHIFT REVENUE</p>
          <h3 className="text-3xl font-bold text-white mt-1">$26,600.00</h3>
          <p className="text-xs text-[#4caf50] mt-1 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> +14.2% vs target
          </p>
        </div>

        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 shadow-md">
          <p className="text-xs text-[#a09a8e] uppercase">PEAK ORDER HOUR</p>
          <h3 className="text-3xl font-bold text-white mt-1">19:00</h3>
          <p className="text-xs text-[#ff9800] mt-1">72 orders / hr rush</p>
        </div>

        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 shadow-md">
          <p className="text-xs text-[#a09a8e] uppercase">TOP YIELD CATEGORY</p>
          <h3 className="text-2xl font-bold text-[#ff4d25] mt-1 truncate">GRILL (45%)</h3>
          <p className="text-xs text-[#a09a8e] mt-1">$11,970 gross revenue</p>
        </div>

        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 shadow-md">
          <p className="text-xs text-[#a09a8e] uppercase">AVG SPEND / GUEST</p>
          <h3 className="text-3xl font-bold text-white mt-1">$138.54</h3>
          <p className="text-xs text-[#4caf50] mt-1">+8.2% cover average</p>
        </div>
      </div>

      {/* CHARTS GRID: BAR CHART & DONUT CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
        
        {/* CHART 1: ORDERS-BY-HOUR BAR CHART */}
        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#322e2a] pb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-[#ff4d25]" />
              <div>
                <h3 className="font-header text-2xl text-white tracking-wide">ORDERS BY HOUR</h3>
                <p className="text-xs text-[#a09a8e]">DINNER SERVICE PACING (16:00 - 23:00)</p>
              </div>
            </div>
            <span className="text-xs text-[#ff9800] bg-[#121110] px-2.5 py-1 rounded border border-[#322e2a]">
              293 TOTAL
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyOrdersData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#322e2a" vertical={false} />
                <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontFamily: 'Inter',
                    color: '#f8fafc'
                  }}
                  formatter={(value) => [`${value} Orders`, 'Volume']}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: REVENUE-BY-CATEGORY DONUT CHART */}
        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#322e2a] pb-4">
            <div className="flex items-center space-x-2">
              <PieChartIcon className="w-5 h-5 text-[#ff9800]" />
              <div>
                <h3 className="font-header text-2xl text-white tracking-wide">REVENUE BY CATEGORY</h3>
                <p className="text-xs text-[#a09a8e]">SALES BREAKDOWN BY KITCHEN STATION</p>
              </div>
            </div>
            <span className="text-xs text-[#4caf50] bg-[#121110] px-2.5 py-1 rounded border border-[#322e2a]">
              $26.6K GROSS
            </span>
          </div>

          <div className="h-72 w-full pt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {revenueByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1a1816" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontFamily: 'Inter',
                    color: '#f8fafc'
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontFamily: 'Inter', fontSize: '11px', color: '#94a3b8' }}
                />

              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Category Breakdown Details Table */}
      <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 shadow-xl font-mono text-xs">
        <h4 className="font-header text-xl text-white mb-3">STATION REVENUE DETAILS</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#322e2a] text-[#6e675e] uppercase">
                <th className="py-2.5 px-3">STATION / CATEGORY</th>
                <th className="py-2.5 px-3">GROSS REVENUE</th>
                <th className="py-2.5 px-3">SHARE %</th>
                <th className="py-2.5 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#322e2a]/50 text-[#e6e4df]">
              {revenueByCategoryData.map((cat, idx) => (
                <tr key={idx} className="hover:bg-[#221f1c]">
                  <td className="py-3 px-3 flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="font-bold text-white">{cat.name}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#ff9800]">${cat.value.toLocaleString()}.00</td>
                  <td className="py-3 px-3">{((cat.value / 26600) * 100).toFixed(1)}%</td>
                  <td className="py-3 px-3 text-right">
                    <span className="badge-herb px-2 py-0.5 rounded text-[10px] font-bold">
                      ON TARGET
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
