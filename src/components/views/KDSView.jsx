import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Flame, Clock, CheckCircle2, AlertCircle, ChefHat, Play, Check, CheckCheck } from 'lucide-react';

export default function KDSView() {
  const { orders, updateOrderStatus } = useRestaurant();

  // KDS Color Coding mapping as requested:
  // Gray = New, Orange = Preparing, Blue = Ready, Green = Completed
  const getKDSColorClass = (kdsStatus) => {
    switch (kdsStatus) {
      case 'New':
        return {
          cardBg: 'bg-[#1e293b] border-gray-500',
          badgeBg: 'bg-gray-500/20 text-gray-300 border border-gray-500/40',
          btnBg: 'bg-orange-500 hover:bg-orange-600 text-white'
        };
      case 'Preparing':
        return {
          cardBg: 'bg-[#1e293b] border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]',
          badgeBg: 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
          btnBg: 'bg-blue-500 hover:bg-blue-600 text-white'
        };
      case 'Ready':
        return {
          cardBg: 'bg-[#1e293b] border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
          badgeBg: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
          btnBg: 'bg-emerald-500 hover:bg-emerald-600 text-white'
        };
      case 'Completed':
        return {
          cardBg: 'bg-[#1e293b] border-emerald-500 opacity-75',
          badgeBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
          btnBg: 'bg-gray-600 text-white cursor-default'
        };
      default:
        return {
          cardBg: 'bg-[#1e293b] border-gray-500',
          badgeBg: 'bg-gray-500/20 text-gray-300 border border-gray-500/40',
          btnBg: 'bg-orange-500 text-white'
        };
    }
  };

  const activeKDSOrders = orders.filter((o) => o.status !== 'Cancelled');

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top KDS Header */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">KITCHEN DISPLAY SYSTEM (KDS)</h2>
            <p className="text-[#94a3b8]">Live real-time order queue synchronized across kitchen screens</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 font-semibold text-xs bg-[#0f172a] px-3.5 py-2 rounded-lg border border-[#334155]">
          <span className="text-[#94a3b8] mr-1">COLOR CODING:</span>
          <span className="flex items-center space-x-1 text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
            <span>Gray = New</span>
          </span>
          <span className="flex items-center space-x-1 text-orange-400">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Orange = Preparing</span>
          </span>
          <span className="flex items-center space-x-1 text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Blue = Ready</span>
          </span>
          <span className="flex items-center space-x-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Green = Completed</span>
          </span>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {activeKDSOrders.length === 0 ? (
          <div className="col-span-full bg-[#1e293b] border border-dashed border-[#334155] rounded-xl p-12 text-center text-[#64748b] space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#10b981] mx-auto" />
            <p className="text-lg text-white font-bold">ALL KITCHEN TICKETS CLEARED</p>
            <p>No active orders waiting in the queue.</p>
          </div>
        ) : (
          activeKDSOrders.map((ord) => {
            const kdsColor = getKDSColorClass(ord.kdsStatus || 'New');

            return (
              <div
                key={ord.id}
                className={`border-2 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-xl transition-all duration-200 ${kdsColor.cardBg}`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between border-b border-[#334155] pb-3 mb-3">
                    <div>
                      <span className="text-[11px] font-bold text-[#3b82f6] block font-mono">{ord.id}</span>
                      <h4 className="text-lg font-bold text-white leading-none">
                        {ord.type === 'Dine-In' ? `TBL #${ord.tableNumber}` : `DELIVERY #${ord.id}`}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${kdsColor.badgeBg}`}>
                        {(ord.kdsStatus || 'New').toUpperCase()}
                      </span>
                      <span className="block text-xs text-[#94a3b8] mt-1 font-mono">
                        ⏱ {ord.timeElapsed || '1m'}
                      </span>
                    </div>
                  </div>

                  {/* Meta Details */}
                  <div className="text-[11px] text-[#94a3b8] space-y-0.5 mb-3 bg-[#0f172a] p-2 rounded border border-[#334155]">
                    <p>Type: <strong className="text-white">{ord.type}</strong></p>
                    <p>Staff: <strong className="text-white">{ord.waiterName || 'Marco S.'}</strong></p>
                    {ord.specialInstructions && (
                      <p className="text-orange-400 font-semibold italic">
                        Note: {ord.specialInstructions}
                      </p>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 mb-2 font-mono">
                    {ord.items?.map((item, idx) => (
                      <div key={idx} className="border-b border-[#334155]/60 pb-1.5 last:border-none flex justify-between items-start">
                        <div>
                          <p className="font-bold text-white text-xs">
                            <span className="text-orange-400 font-extrabold text-sm mr-1">{item.qty}x</span>
                            {item.name}
                          </p>
                          {item.mod && <p className="text-[11px] text-[#94a3b8] italic pl-4">• {item.mod}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KDS Action Buttons */}
                <div className="pt-3 border-t border-[#334155] space-y-2 font-semibold">
                  {ord.kdsStatus === 'New' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Preparing', 'Preparing')}
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Accept & Prep</span>
                      </button>
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Ready', 'Ready')}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Ready</span>
                      </button>
                    </div>
                  )}

                  {ord.kdsStatus === 'Preparing' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'Ready', 'Ready')}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center space-x-1 cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark Ready to Serve</span>
                    </button>
                  )}

                  {ord.kdsStatus === 'Ready' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'Completed', 'Completed')}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg flex items-center justify-center space-x-1 cursor-pointer shadow-md"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>Complete Order</span>
                    </button>
                  )}

                  {ord.kdsStatus === 'Completed' && (
                    <div className="bg-emerald-500/20 text-emerald-400 text-center py-2 rounded-lg font-bold border border-emerald-500/30">
                      ✓ ORDER COMPLETED
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
