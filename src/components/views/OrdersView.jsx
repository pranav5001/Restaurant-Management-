import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, Move } from 'lucide-react';


const initialKanbanOrders = [
  {
    id: 'TK-108',
    table: 'TBL #04',
    server: 'Marco S.',
    station: 'Grill',
    timeElapsed: '18m 40s',
    status: 'new',
    items: [
      { name: 'Dry-Aged Ribeye (Medium Rare)', qty: 2, mod: 'Extra smoked salt' },
      { name: 'Wood-Fired Bone Marrow', qty: 1, mod: 'Grilled sourdough' }
    ],
    total: '$194.00'
  },
  {
    id: 'TK-109',
    table: 'TBL #12',
    server: 'Elena R.',
    station: 'Saute',
    timeElapsed: '11m 15s',
    status: 'preparing',
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
    station: 'Pantry',
    timeElapsed: '04m 20s',
    status: 'ready',
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
    station: 'Grill',
    timeElapsed: '02m 05s',
    status: 'new',
    items: [
      { name: 'Tomahawk Ribeye 32oz', qty: 1, mod: 'Chef recommendation' },
      { name: 'Duck Fat Potatoes', qty: 2, mod: 'Crispy rosemary' }
    ],
    total: '$310.00'
  },
  {
    id: 'TK-107',
    table: 'TBL #01',
    server: 'Marco S.',
    station: 'Pantry',
    timeElapsed: '25m 10s',
    status: 'served',
    items: [
      { name: 'Oyster Platter (12pc)', qty: 1, mod: 'Mignonette sauce' },
      { name: 'Chablis Premier Cru', qty: 2, mod: 'Chilled glasses' }
    ],
    total: '$165.00'
  },
  {
    id: 'TK-106',
    table: 'TBL #06',
    server: 'Elena R.',
    station: 'Saute',
    timeElapsed: '32m 00s',
    status: 'served',
    items: [
      { name: 'Pan-Roasted Duck Breast', qty: 1, mod: 'Cherry reduction' }
    ],
    total: '$89.00'
  }
];

const columns = [
  { id: 'new', title: 'New', colorBadge: 'badge-rust', borderHeader: 'border-l-4 border-l-[#f44336]' },
  { id: 'preparing', title: 'Preparing', colorBadge: 'badge-turmeric', borderHeader: 'border-l-4 border-l-[#ff9800]' },
  { id: 'ready', title: 'Ready', colorBadge: 'badge-herb', borderHeader: 'border-l-4 border-l-[#4caf50]' },
  { id: 'served', title: 'Served', colorBadge: 'bg-[#322e2a] text-[#a09a8e]', borderHeader: 'border-l-4 border-l-[#6e675e]' }
];

export default function OrdersView({ searchQuery }) {
  const [orders, setOrders] = useState(initialKanbanOrders);
  const [draggedOrderId, setDraggedOrderId] = useState(null);

  // Drag and drop handlers
  const handleDragStart = (e, orderId) => {
    setDraggedOrderId(orderId);
    e.dataTransfer.setData('text/plain', orderId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedOrderId) return;
    setOrders((prev) =>
      prev.map((ord) => (ord.id === draggedOrderId ? { ...ord, status: targetColumnId } : ord))
    );
    setDraggedOrderId(null);
  };

  // Fallback Advance button handler
  const handleAdvance = (orderId, currentStatus) => {
    const statusFlow = { new: 'preparing', preparing: 'ready', ready: 'served', served: 'served' };
    const nextStatus = statusFlow[currentStatus];
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
    );
  };

  const filteredOrders = orders.filter((ord) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      ord.id.toLowerCase().includes(query) ||
      ord.table.toLowerCase().includes(query) ||
      ord.server.toLowerCase().includes(query) ||
      ord.items.some((i) => i.name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6 font-body">
      {/* Kanban Header Instructions */}
      <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs shadow-md">
        <div className="flex items-center space-x-2 text-[#e6e4df]">
          <Move className="w-4 h-4 text-[#ff4d25]" />
          <span>DRAG & DROP TICKETS BETWEEN COLUMNS OR USE THE <strong>ADVANCE</strong> BUTTON</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-[#a09a8e]">
          <span>TOTAL ORDERS: <strong className="text-white">{filteredOrders.length}</strong></span>
        </div>
      </div>

      {/* 4-Column Kanban Board (Horizontally scrollable on mobile, 4-col grid on desktop) */}
      <div className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-6 items-start overflow-x-auto pb-4 snap-x scrollbar-thin">
        {columns.map((col) => {
          const colOrders = filteredOrders.filter((ord) => ord.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-4 flex flex-col space-y-4 min-h-[500px] shadow-xl w-[280px] sm:w-[320px] lg:w-auto flex-shrink-0 snap-start"
            >
              {/* Column Header */}
              <div className={`bg-[#121110] p-3 rounded-lg border border-[#322e2a] flex items-center justify-between font-mono ${col.borderHeader}`}>

                <h3 className="font-bold text-white uppercase text-sm tracking-wider">{col.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${col.colorBadge}`}>
                  {colOrders.length}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="space-y-4 flex-1">
                {colOrders.length === 0 ? (
                  <div className="border border-dashed border-[#322e2a] rounded-lg p-8 text-center text-[#6e675e] font-mono text-xs">
                    No tickets in {col.title}
                  </div>
                ) : (
                  colOrders.map((ord) => (
                    <div
                      key={ord.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ord.id)}
                      className="ticket-paper rounded p-4 flex flex-col justify-between cursor-grab active:cursor-grabbing transition-all duration-200 hover:-translate-y-1 shadow-lg"
                    >
                      {/* Ticket Header */}
                      <div>
                        <div className="flex items-center justify-between border-b border-dashed border-[#1c1a17]/20 pb-2 mb-2">
                          <div>
                            <span className="text-[11px] font-bold tracking-widest text-[#6e675e] block font-mono">
                              {ord.id}
                            </span>
                            <h4 className="text-lg font-bold text-[#1c1a17] font-mono leading-none">
                              {ord.table}
                            </h4>
                          </div>

                          <div className="text-right font-mono">
                            <span className="block text-xs font-bold text-[#1c1a17]">
                              ⏱ {ord.timeElapsed}
                            </span>
                            <span className="text-[10px] text-[#6e675e] uppercase">
                              {ord.station}
                            </span>
                          </div>
                        </div>

                        {/* Ticket Items List */}
                        <div className="space-y-1.5 font-mono text-xs my-3">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="border-b border-[#1c1a17]/10 pb-1 last:border-none">
                              <div className="flex justify-between font-bold text-[#1c1a17]">
                                <span>{item.qty}x {item.name}</span>
                              </div>
                              {item.mod && (
                                <div className="text-[10px] text-[#ff4d25] font-semibold italic pl-2 mt-0.5">
                                  • {item.mod}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ticket Footer & Fallback Advance Button */}
                      <div className="pt-2 border-t border-dashed border-[#1c1a17]/30 flex items-center justify-between font-mono">
                        <span className="font-bold text-[#1c1a17] text-xs">{ord.total}</span>

                        {ord.status !== 'served' ? (
                          <button
                            type="button"
                            onClick={() => handleAdvance(ord.id, ord.status)}
                            className="bg-[#1c1a17] hover:bg-[#ff4d25] text-[#f6f3eb] hover:text-white px-2.5 py-1 rounded text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            <span>ADVANCE</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-[#4caf50] flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> SERVED
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
