import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  ShoppingBag,
  Utensils,
  Truck,
  Flame,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Grid,
  TrendingUp,
  Award,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const sevenDayRevenueData = [
  { day: 'Mon', revenue: 14200 },
  { day: 'Tue', revenue: 16800 },
  { day: 'Wed', revenue: 18500 },
  { day: 'Thu', revenue: 21400 },
  { day: 'Fri', revenue: 26600 },
  { day: 'Sat', revenue: 31200 },
  { day: 'Sun', revenue: 24800 },
];

export default function DashboardView({ searchQuery }) {
  const { orders, tables, foods } = useRestaurant();

  // Calculate 9 Dashboard Stat Cards Metrics
  const totalOrdersToday = orders.length;
  const dineInOrders = orders.filter((o) => o.type === 'Dine-In').length;
  const deliveryOrders = orders.filter((o) => o.type === 'Delivery').length;
  const kitchenOrders = orders.filter((o) => o.kdsStatus === 'New' || o.kdsStatus === 'Preparing').length;
  const completedOrders = orders.filter((o) => o.status === 'Completed' || o.status === 'Delivered').length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing').length;
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;
  const totalRevenue = orders.filter((o) => o.isPaid || o.status === 'Completed').reduce((sum, o) => sum + o.totalAmount, 0);
  const activeTablesCount = tables.filter((t) => t.status === 'Occupied').length;

  const popularFoods = foods.slice(0, 5);

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* SECTION 1: 9 STAT CARDS GRID */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-9 gap-3">
        {/* 1. Total Orders Today */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <p className="text-[10px] text-[#94a3b8] uppercase font-bold truncate">Total Orders</p>
          <h3 className="text-xl font-bold text-white mt-1 font-mono">{totalOrdersToday}</h3>
          <p className="text-[10px] text-[#3b82f6] mt-0.5">+12 today</p>
        </div>

        {/* 2. Dine-In Orders */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <p className="text-[10px] text-[#94a3b8] uppercase font-bold truncate">Dine-In Orders</p>
          <h3 className="text-xl font-bold text-white mt-1 font-mono">{dineInOrders}</h3>
          <p className="text-[10px] text-[#10b981] mt-0.5">Tables active</p>
        </div>

        {/* 3. Delivery Orders */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <p className="text-[10px] text-[#94a3b8] uppercase font-bold truncate">Delivery Orders</p>
          <h3 className="text-xl font-bold text-white mt-1 font-mono">{deliveryOrders}</h3>
          <p className="text-[10px] text-[#3b82f6] mt-0.5">Live dispatch</p>
        </div>

        {/* 4. Kitchen Orders */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <p className="text-[10px] text-[#94a3b8] uppercase font-bold truncate">Kitchen Orders</p>
          <h3 className="text-xl font-bold text-orange-400 mt-1 font-mono">{kitchenOrders}</h3>
          <p className="text-[10px] text-orange-400 mt-0.5">Active in KDS</p>
        </div>

        {/* 5. Completed Orders */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <p className="text-[10px] text-[#94a3b8] uppercase font-bold truncate">Completed</p>
          <h3 className="text-xl font-bold text-[#10b981] mt-1 font-mono">{completedOrders}</h3>
          <p className="text-[10px] text-[#10b981] mt-0.5">Fulfilled</p>
        </div>

        {/* 6. Pending Orders */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <p className="text-[10px] text-[#94a3b8] uppercase font-bold truncate">Pending</p>
          <h3 className="text-xl font-bold text-[#f59e0b] mt-1 font-mono">{pendingOrders}</h3>
          <p className="text-[10px] text-[#f59e0b] mt-0.5">In progress</p>
        </div>

        {/* 7. Cancelled Orders */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <p className="text-[10px] text-[#94a3b8] uppercase font-bold truncate">Cancelled</p>
          <h3 className="text-xl font-bold text-[#ef4444] mt-1 font-mono">{cancelledOrders}</h3>
          <p className="text-[10px] text-[#ef4444] mt-0.5">Voided</p>
        </div>

        {/* 8. Total Revenue */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <p className="text-[10px] text-[#94a3b8] uppercase font-bold truncate">Total Revenue</p>
          <h3 className="text-xl font-bold text-[#10b981] mt-1 font-mono">${totalRevenue.toFixed(0)}</h3>
          <p className="text-[10px] text-[#10b981] mt-0.5">+18.4% week</p>
        </div>

        {/* 9. Active Tables */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-3.5 shadow-md">
          <p className="text-[10px] text-[#94a3b8] uppercase font-bold truncate">Active Tables</p>
          <h3 className="text-xl font-bold text-white mt-1 font-mono">{activeTablesCount} / {tables.length}</h3>
          <p className="text-[10px] text-[#3b82f6] mt-0.5">Occupied</p>
        </div>
      </section>

      {/* SECTION 2: CHARTS & POPULAR FOOD ITEMS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <div>
              <h3 className="text-base font-bold text-white">REVENUE TREND & PACING</h3>
              <p className="text-xs text-[#94a3b8]">7-Day Shift Sales Overview (Mon - Sun)</p>
            </div>
            <span className="bg-[#10b981]/10 text-[#10b981] px-2.5 py-1 rounded text-xs font-bold border border-[#10b981]/30">
              Peak: Sat ($31.2K)
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sevenDayRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontFamily: 'Inter',
                    color: '#f8fafc'
                  }}
                  formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Food Items List */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#f59e0b]" />
              <h3 className="text-base font-bold text-white">POPULAR FOOD ITEMS</h3>
            </div>
            <span className="text-[10px] text-[#94a3b8] bg-[#0f172a] px-2 py-1 rounded border border-[#334155]">
              TODAY
            </span>
          </div>

          <div className="space-y-3">
            {popularFoods.map((food, idx) => (
              <div key={food.id} className="bg-[#0f172a] border border-[#334155] p-2.5 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <img src={food.image} alt={food.name} className="w-9 h-9 rounded object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate text-xs">{food.name}</p>
                    <p className="text-[10px] text-[#94a3b8]">{food.category} • ${food.price.toFixed(2)}</p>
                  </div>
                </div>
                <span className="bg-[#3b82f6]/20 text-[#3b82f6] px-2 py-0.5 rounded font-bold text-[11px]">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: RECENT ORDERS TABLE */}
      <section className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white border-b border-[#334155] pb-3">
          RECENT ORDERS OVERVIEW
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#334155] text-[#64748b] uppercase">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Customer / Table</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">KDS Status</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-[#0f172a]/50">
                  <td className="py-3 px-3 font-bold text-[#3b82f6]">{ord.id}</td>
                  <td className="py-3 px-3 text-[#94a3b8]">{ord.type}</td>
                  <td className="py-3 px-3 font-semibold text-white">
                    {ord.customerName} ({ord.type === 'Dine-In' ? `TBL #${ord.tableNumber}` : 'Delivery'})
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-[#3b82f6]/20 text-[#3b82f6] px-2 py-0.5 rounded text-[10px] font-bold">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-[10px] font-bold">
                      {ord.kdsStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#10b981]">${ord.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
