import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Grid,
  Clock,
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Filter,
  RefreshCw,
  Sparkles,
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

// 7-Day Revenue Data for Area Chart
const sevenDayRevenueData = [
  { day: 'Mon', revenue: 14200, orders: 110 },
  { day: 'Tue', revenue: 16800, orders: 128 },
  { day: 'Wed', revenue: 18500, orders: 142 },
  { day: 'Thu', revenue: 21400, orders: 160 },
  { day: 'Fri', revenue: 26600, orders: 192 },
  { day: 'Sat', revenue: 31200, orders: 224 },
  { day: 'Sun', revenue: 24800, orders: 180 },
];

// Top Selling Dishes Data
const topSellers = [
  { rank: 1, name: 'Dry-Aged Ribeye 16oz', category: 'GRILL', salesCount: 42, revenue: '$2,856.00', trend: '+18%' },
  { rank: 2, name: 'Cinder Smoked Smash Burger', category: 'PANTRY', salesCount: 38, revenue: '$836.00', trend: '+24%' },
  { rank: 3, name: 'Pan-Seared Sea Scallops', category: 'SAUTE', salesCount: 31, revenue: '$1,302.00', trend: '+12%' },
  { rank: 4, name: 'Truffle Tagliatelle', category: 'MAINS', salesCount: 26, revenue: '$988.00', trend: '+8%' },
  { rank: 5, name: 'Wood-Fired Bone Marrow', category: 'STARTERS', salesCount: 22, revenue: '$528.00', trend: '+15%' },
];

// Active Kitchen Expedite Rail Mock Data
const initialTickets = [
  {
    id: 'TK-108',
    table: 'TBL #04',
    server: 'Marco S.',
    timeElapsed: '18m 40s',
    status: 'delayed',
    station: 'Grill',
    items: [
      { name: 'Dry-Aged Ribeye (Medium Rare)', qty: 2, mod: 'Extra smoked salt' },
      { name: 'Wood-Fired Bone Marrow', qty: 1, mod: 'Grilled sourdough' },
      { name: 'Charred Broccolini', qty: 2, mod: 'Chili garlic oil' }
    ],
    total: '$194.00'
  },
  {
    id: 'TK-109',
    table: 'TBL #12',
    server: 'Elena R.',
    timeElapsed: '11m 15s',
    status: 'cooking',
    station: 'Saute',
    items: [
      { name: 'Pan-Seared Scallops', qty: 1, mod: 'Corn puree base' },
      { name: 'Truffle Tagliatelle', qty: 1, mod: 'Shaved black truffle' }
    ],
    total: '$128.50'
  },
  {
    id: 'TK-110',
    table: 'BAR #02',
    server: 'David K.',
    timeElapsed: '04m 20s',
    status: 'ready',
    station: 'Pantry',
    items: [
      { name: 'Cinder Smoked Smash Burger', qty: 1, mod: 'Double bacon' },
      { name: 'Tallow Hand-Cut Fries', qty: 1, mod: 'Aioli dip' }
    ],
    total: '$42.00'
  },
  {
    id: 'TK-111',
    table: 'TBL #09',
    server: 'Sarah M.',
    timeElapsed: '02m 05s',
    status: 'cooking',
    station: 'Grill',
    items: [
      { name: 'Tomahawk Ribeye 32oz', qty: 1, mod: 'Chef recommendation' },
      { name: 'Duck Fat Potatoes', qty: 2, mod: 'Crispy rosemary' }
    ],
    total: '$310.00'
  }
];

export default function DashboardView({ searchQuery }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [activeStation, setActiveStation] = useState('ALL');

  const handleBumpTicket = (id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStation = activeStation === 'ALL' || t.station.toUpperCase() === activeStation;
    const matchesSearch = !searchQuery ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.server.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStation && matchesSearch;
  });

  return (
    <div className="space-y-6 font-body">
      {/* SECTION 1: 4 STAT CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Card 1: Today's Revenue */}
        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 flex items-center justify-between shadow-md hover:border-[#ff4d25]/40 transition-all">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#a09a8e]">TODAY'S REVENUE</p>
            <h3 className="text-3xl font-bold text-white mt-1">$26,600.00</h3>
            <div className="flex items-center space-x-1 text-xs text-[#4caf50] mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs last week</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#ff4d25]/10 border border-[#ff4d25]/30 flex items-center justify-center text-[#ff4d25] shadow-[0_0_15px_rgba(255,77,37,0.2)]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Orders Today */}
        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 flex items-center justify-between shadow-md hover:border-[#ff4d25]/40 transition-all">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#a09a8e]">ORDERS TODAY</p>
            <h3 className="text-3xl font-bold text-white mt-1">192</h3>
            <div className="flex items-center space-x-1 text-xs text-[#ff9800] mt-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>+12 orders during dinner rush</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ff9800]">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Active Tables */}
        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 flex items-center justify-between shadow-md hover:border-[#ff4d25]/40 transition-all">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#a09a8e]">ACTIVE TABLES</p>
            <h3 className="text-3xl font-bold text-white mt-1">7 / 12</h3>
            <div className="flex items-center space-x-1 text-xs text-[#4caf50] mt-1">
              <Grid className="w-3.5 h-3.5" />
              <span>58% dining room load</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#4caf50]">
            <Grid className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Avg Ticket Time */}
        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 flex items-center justify-between shadow-md hover:border-[#ff4d25]/40 transition-all">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#a09a8e]">AVG TICKET TIME</p>
            <h3 className="text-3xl font-bold text-white mt-1">14.2 min</h3>
            <div className="flex items-center space-x-1 text-xs text-[#4caf50] mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>-2.1m faster than target</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* SECTION 2: 7-DAY REVENUE CHART & TOP SELLERS GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Revenue Area Chart (2 Columns Wide on Large Screens) */}
        <div className="lg:col-span-2 bg-[#1a1816] border border-[#322e2a] rounded-xl p-6 space-y-4 shadow-xl font-mono">
          <div className="flex items-center justify-between border-b border-[#322e2a] pb-4">
            <div>
              <h3 className="font-header text-2xl text-white tracking-wide">7-DAY REVENUE TREND</h3>
              <p className="text-xs text-[#a09a8e]">WEEKLY GROSS SALES OVERVIEW (MON - SUN)</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-[#4caf50]">
              <Sparkles className="w-4 h-4 text-[#ff4d25]" />
              <span>PEAK: SAT ($31.2K)</span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sevenDayRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="sevenDayGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4d25" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#ff4d25" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#322e2a" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Inter' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Inter' }} />
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

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff4d25"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#sevenDayGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Sellers List (1 Column Wide) */}
        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-xl font-mono">
          <div className="flex items-center justify-between border-b border-[#322e2a] pb-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#ff9800]" />
              <h3 className="font-header text-2xl text-white tracking-wide">TOP SELLERS</h3>
            </div>
            <span className="text-[10px] text-[#a09a8e] bg-[#121110] px-2 py-1 rounded border border-[#322e2a]">
              TONIGHT
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {topSellers.map((item) => (
              <div
                key={item.rank}
                className="bg-[#121110] border border-[#322e2a] rounded-lg p-3 flex items-center justify-between hover:border-[#ff4d25]/40 transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded font-bold text-xs flex items-center justify-center ${
                      item.rank === 1
                        ? 'bg-[#ff4d25] text-white shadow-[0_0_10px_rgba(255,77,37,0.5)]'
                        : 'bg-[#221f1c] text-[#a09a8e] border border-[#322e2a]'
                    }`}
                  >
                    #{item.rank}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-[#a09a8e] mt-0.5">
                      {item.salesCount} orders • <span className="text-[#ff9800]">{item.category}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#e6e4df] block">{item.revenue}</span>
                  <span className="text-[10px] text-[#4caf50] flex items-center justify-end">
                    <ArrowUpRight className="w-3 h-3" /> {item.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: LIVE EXPEDITE RAIL */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1a1816] border border-[#322e2a] p-3.5 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#ff4d25]/10 border border-[#ff4d25]/30 flex items-center justify-center text-[#ff4d25]">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-header text-2xl text-white leading-none">LIVE EXPEDITE RAIL</h3>
              <p className="text-xs font-mono text-[#a09a8e]">{filteredTickets.length} ACTIVE KITCHEN TICKETS</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <Filter className="w-4 h-4 text-[#ff4d25]" />
            {['ALL', 'GRILL', 'SAUTE', 'PANTRY'].map((st) => (
              <button
                key={st}
                onClick={() => setActiveStation(st)}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeStation === st
                    ? 'bg-[#ff4d25] text-white font-bold shadow-[0_0_10px_rgba(255,77,37,0.3)]'
                    : 'bg-[#121110] text-[#a09a8e] hover:text-white border border-[#322e2a]'
                }`}
              >
                {st}
              </button>
            ))}

            <button
              onClick={() => setTickets(initialTickets)}
              className="text-xs text-[#a09a8e] hover:text-white p-1.5 cursor-pointer ml-2"
              title="Reset Tickets"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="bg-[#1a1816] border border-dashed border-[#322e2a] rounded-xl p-10 text-center text-[#6e675e] font-mono space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#4caf50] mx-auto" />
            <p className="text-lg text-white">ALL TICKETS CLEARED</p>
            <p className="text-xs">No active orders found for station {activeStation}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {filteredTickets.map((ticket) => {
              let badgeClass = 'badge-turmeric';
              let statusLabel = 'COOKING';
              if (ticket.status === 'ready') {
                badgeClass = 'badge-herb';
                statusLabel = 'READY';
              } else if (ticket.status === 'delayed') {
                badgeClass = 'badge-rust';
                statusLabel = 'DELAYED';
              }

              return (
                <div key={ticket.id} className="ticket-paper rounded p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between border-b border-dashed border-[#1c1a17]/20 pb-2 mb-3">
                      <div>
                        <span className="text-xs font-bold tracking-widest text-[#6e675e] block">{ticket.id}</span>
                        <h4 className="text-xl font-bold text-[#1c1a17] font-mono leading-none">{ticket.table}</h4>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${badgeClass}`}>
                          {statusLabel}
                        </span>
                        <span className="block text-xs font-bold text-[#1c1a17] font-mono mt-1">⏱ {ticket.timeElapsed}</span>
                      </div>
                    </div>

                    <div className="text-xs text-[#6e675e] font-mono mb-3 flex justify-between">
                      <span>Station: <strong>{ticket.station}</strong></span>
                      <span>Server: {ticket.server}</span>
                    </div>

                    <div className="space-y-2 font-mono text-xs mb-4">
                      {ticket.items.map((item, idx) => (
                        <div key={idx} className="border-b border-[#1c1a17]/10 pb-1.5 last:border-none">
                          <div className="flex justify-between font-bold text-[#1c1a17]">
                            <span>{item.qty}x {item.name}</span>
                          </div>
                          {item.mod && (
                            <div className="text-[11px] text-[#ff4d25] font-semibold italic pl-3 mt-0.5">
                              • MOD: {item.mod}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-dashed border-[#1c1a17]/30 flex items-center justify-between">
                    <span className="font-bold text-[#1c1a17] text-sm font-mono">{ticket.total}</span>
                    <button
                      onClick={() => handleBumpTicket(ticket.id)}
                      className="bg-[#1c1a17] hover:bg-[#ff4d25] text-[#f6f3eb] hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer font-mono"
                    >
                      BUMP
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
