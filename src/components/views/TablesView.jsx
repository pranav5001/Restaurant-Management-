import React, { useState } from 'react';
import { Grid, Users, Clock, RefreshCw } from 'lucide-react';


const initialTables = [
  { id: '01', seats: 2, status: 'available', server: '-', order: '-', time: '-' },
  { id: '02', seats: 4, status: 'occupied', server: 'Marco S.', order: '$89.00', time: '30m' },
  { id: '03', seats: 2, status: 'available', server: '-', order: '-', time: '-' },
  { id: '04', seats: 4, status: 'occupied', server: 'Marco S.', order: '$194.00', time: '18m' },
  { id: '05', seats: 6, status: 'reserved', server: 'Elena R.', order: 'RESERVED (20:00)', time: '-' },
  { id: '06', seats: 4, status: 'occupied', server: 'David K.', order: '$89.00', time: '29m' },
  { id: '07', seats: 2, status: 'available', server: '-', order: '-', time: '-' },
  { id: '08', seats: 8, status: 'reserved', server: 'Sarah M.', order: 'RESERVED (20:30)', time: '-' },
  { id: '09', seats: 6, status: 'occupied', server: 'Sarah M.', order: '$310.00', time: '02m' },
  { id: '10', seats: 4, status: 'available', server: '-', order: '-', time: '-' },
  { id: '11', seats: 2, status: 'occupied', server: 'Elena R.', order: '$128.50', time: '11m' },
  { id: '12', seats: 4, status: 'occupied', server: 'David K.', order: '$215.00', time: '52m' },
  { id: '13', seats: 2, status: 'available', server: '-', order: '-', time: '-' },
  { id: '14', seats: 4, status: 'reserved', server: 'Marco S.', order: 'RESERVED (21:00)', time: '-' },
  { id: '15', seats: 6, status: 'available', server: '-', order: '-', time: '-' },
  { id: '16', seats: 8, status: 'available', server: '-', order: '-', time: '-' },
];

export default function TablesView({ searchQuery }) {
  const [tables, setTables] = useState(initialTables);

  // Cycle status function: Available -> Occupied -> Reserved -> Available
  const cycleTableStatus = (tableId) => {
    const statusCycle = {
      available: 'occupied',
      occupied: 'reserved',
      reserved: 'available'
    };

    setTables((prev) =>
      prev.map((tbl) => {
        if (tbl.id === tableId) {
          const nextStatus = statusCycle[tbl.status];
          return {
            ...tbl,
            status: nextStatus,
            server: nextStatus === 'available' ? '-' : tbl.server === '-' ? 'Marco S.' : tbl.server,
            order: nextStatus === 'available' ? '-' : nextStatus === 'reserved' ? 'RESERVED (8:00 PM)' : '$120.00',
            time: nextStatus === 'occupied' ? '05m' : '-'
          };
        }
        return tbl;
      })
    );
  };

  const filteredTables = tables.filter((tbl) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tbl.id.includes(query) ||
      tbl.status.toLowerCase().includes(query) ||
      tbl.server.toLowerCase().includes(query)
    );
  });

  const availableCount = tables.filter((t) => t.status === 'available').length;
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const reservedCount = tables.filter((t) => t.status === 'reserved').length;
  const availableSeats = tables
    .filter((t) => t.status === 'available')
    .reduce((sum, t) => sum + t.seats, 0);

  return (
    <div className="space-y-6 font-body">
      {/* Top Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 shadow-md">
          <p className="text-xs text-[#a09a8e] uppercase">AVAILABLE TABLES</p>
          <p className="text-3xl font-bold text-[#4caf50] mt-1">{availableCount} / {tables.length}</p>
          <p className="text-xs text-[#a09a8e] mt-1">{availableSeats} open seats</p>
        </div>

        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 shadow-md">
          <p className="text-xs text-[#a09a8e] uppercase">OCCUPIED TABLES</p>
          <p className="text-3xl font-bold text-[#ff9800] mt-1">{occupiedCount}</p>
          <p className="text-xs text-[#ff9800] mt-1">Active dining service</p>
        </div>

        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 shadow-md">
          <p className="text-xs text-[#a09a8e] uppercase">RESERVED TABLES</p>
          <p className="text-3xl font-bold text-[#f44336] mt-1">{reservedCount}</p>
          <p className="text-xs text-[#f44336] mt-1">Upcoming party holds</p>
        </div>

        <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-[#a09a8e] uppercase">FLOOR PLAN STATUS</p>
            <p className="text-lg font-bold text-white mt-1">DINING ROOM A</p>
            <p className="text-xs text-[#4caf50] mt-0.5">● Live Sync</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#ff4d25]/10 border border-[#ff4d25]/30 flex items-center justify-center text-[#ff4d25]">
            <Grid className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Instruction Banner */}
      <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-4 flex items-center justify-between font-mono text-xs shadow-md">
        <div className="flex items-center space-x-2 text-[#e6e4df]">
          <RefreshCw className="w-4 h-4 text-[#ff4d25]" />
          <span>CLICK ANY TABLE CARD TO CYCLE ITS STATUS (AVAILABLE ➔ OCCUPIED ➔ RESERVED)</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center space-x-1 text-[#4caf50]">
            <span className="w-2 h-2 rounded-full bg-[#4caf50]" />
            <span>AVAILABLE</span>
          </span>
          <span className="flex items-center space-x-1 text-[#ff9800]">
            <span className="w-2 h-2 rounded-full bg-[#ff9800]" />
            <span>OCCUPIED</span>
          </span>
          <span className="flex items-center space-x-1 text-[#f44336]">
            <span className="w-2 h-2 rounded-full bg-[#f44336]" />
            <span>RESERVED</span>
          </span>
        </div>
      </div>

      {/* Interactive Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 font-mono">

        {filteredTables.map((tbl) => {
          let badgeClass = 'badge-herb';
          let borderClass = 'border-[#322e2a] hover:border-[#4caf50]';
          let glowClass = '';

          if (tbl.status === 'occupied') {
            badgeClass = 'badge-turmeric';
            borderClass = 'border-[#ff9800]/50 hover:border-[#ff9800]';
            glowClass = 'shadow-[0_0_15px_rgba(255,152,0,0.15)]';
          } else if (tbl.status === 'reserved') {
            badgeClass = 'badge-rust';
            borderClass = 'border-[#f44336]/50 hover:border-[#f44336]';
            glowClass = 'shadow-[0_0_15px_rgba(244,67,54,0.15)]';
          }

          return (
            <div
              key={tbl.id}
              onClick={() => cycleTableStatus(tbl.id)}
              className={`bg-[#1a1816] border ${borderClass} ${glowClass} rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xl cursor-pointer transition-all duration-200 hover:-translate-y-1 select-none`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white font-mono">TBL #{tbl.id}</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${badgeClass}`}>
                  {tbl.status.toUpperCase()}
                </span>
              </div>

              {/* Table Info */}
              <div className="space-y-1.5 text-xs text-[#a09a8e]">
                <div className="flex items-center space-x-1.5 text-white font-bold">
                  <Users className="w-4 h-4 text-[#ff4d25]" />
                  <span>{tbl.seats} Seats</span>
                </div>
                <p className="text-[11px]">Server: <strong className="text-white">{tbl.server}</strong></p>
                {tbl.time !== '-' && (
                  <p className="text-[11px] text-[#ff9800] flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Seated {tbl.time} ago</span>
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#322e2a] flex items-center justify-between text-xs">
                <span className="text-[#6e675e] text-[10px]">TAP TO CYCLE</span>
                <span className="font-bold text-white text-xs">{tbl.order}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
