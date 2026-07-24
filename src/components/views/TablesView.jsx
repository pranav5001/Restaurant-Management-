import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Grid, Users, ArrowRightLeft, Shield, CheckCircle, RefreshCw, X } from 'lucide-react';

export default function TablesView({ searchQuery }) {
  const { tables, setTables, addAuditLog } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState(null);
  const [moveTargetTable, setMoveTargetTable] = useState('');

  const filteredTables = tables.filter((t) => {
    return !searchQuery || t.number.includes(searchQuery) || t.status.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'badge-success';
      case 'Occupied':
        return 'badge-danger';
      case 'Reserved':
        return 'badge-warning';
      case 'Cleaning':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      default:
        return 'badge-neutral';
    }
  };

  const handleCycleStatus = (tblId) => {
    const statusCycle = ['Available', 'Occupied', 'Reserved', 'Cleaning'];
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tblId) {
          const nextIdx = (statusCycle.indexOf(t.status) + 1) % statusCycle.length;
          const nextStatus = statusCycle[nextIdx];
          addAuditLog(`Table #${t.number} status changed to ${nextStatus}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleMoveOrder = () => {
    if (!selectedTable || !moveTargetTable) return;
    setTables((prev) =>
      prev.map((t) => {
        if (t.number === selectedTable.number) {
          return { ...t, status: 'Available', currentOrder: null, server: '-' };
        }
        if (t.number === moveTargetTable) {
          return { ...t, status: 'Occupied', currentOrder: selectedTable.currentOrder, server: selectedTable.server };
        }
        return t;
      })
    );
    addAuditLog(`Moved Order from Table #${selectedTable.number} to Table #${moveTargetTable}`);
    setSelectedTable(null);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Banner */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Visual Table Layout & Operations</h2>
            <p className="text-[#94a3b8]">Live dining floor plan (Available, Occupied, Reserved, Cleaning; Merge & Move orders)</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 font-semibold text-xs bg-[#0f172a] px-3.5 py-2 rounded-lg border border-[#334155]">
          <span className="text-[#94a3b8]">STATUS:</span>
          <span className="text-emerald-400">Available</span>
          <span className="text-red-400">Occupied</span>
          <span className="text-amber-400">Reserved</span>
          <span className="text-purple-400">Cleaning</span>
        </div>
      </div>

      {/* Visual Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredTables.map((tbl) => (
          <div
            key={tbl.id}
            onClick={() => setSelectedTable(tbl)}
            className="bg-[#1e293b] border border-[#334155] hover:border-[#3b82f6] rounded-xl p-4 shadow-lg cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[#94a3b8] font-mono text-[10px]">TBL #{tbl.number}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(tbl.status)}`}>
                {tbl.status}
              </span>
            </div>

            <div className="text-center py-2">
              <h3 className="text-2xl font-extrabold text-white font-mono">{tbl.number}</h3>
              <p className="text-[11px] text-[#94a3b8] flex items-center justify-center mt-1">
                <Users className="w-3.5 h-3.5 mr-1" /> {tbl.seats} Seats
              </p>
            </div>

            <div className="border-t border-[#334155] pt-2 text-[10px] text-[#94a3b8] space-y-0.5">
              <p>Order: <strong className="text-white">{tbl.currentOrder || 'None'}</strong></p>
              <p>Server: <strong className="text-white">{tbl.server}</strong></p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Operation Dialog Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <h3 className="text-lg font-bold text-white">OPERATIONS FOR TABLE #{selectedTable.number}</h3>
              <button onClick={() => setSelectedTable(null)} className="text-[#94a3b8] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] space-y-1 font-mono">
              <p className="text-white">Current Status: <span className="text-[#3b82f6] font-bold">{selectedTable.status}</span></p>
              <p className="text-white">Seats: {selectedTable.seats}</p>
              <p className="text-white">Active Order: {selectedTable.currentOrder || 'None'}</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleCycleStatus(selectedTable.id)}
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2.5 rounded-lg font-bold flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Cycle Table Status (Available ➔ Occupied ➔ Reserved ➔ Cleaning)</span>
              </button>

              {selectedTable.currentOrder && (
                <div className="pt-2 border-t border-[#334155] space-y-2">
                  <label className="block text-[#94a3b8] font-bold">Move Order to Target Table</label>
                  <div className="flex gap-2">
                    <select
                      value={moveTargetTable}
                      onChange={(e) => setMoveTargetTable(e.target.value)}
                      className="flex-1 bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                    >
                      <option value="">Select Target Table</option>
                      {tables
                        .filter((t) => t.number !== selectedTable.number && t.status === 'Available')
                        .map((t) => (
                          <option key={t.id} value={t.number}>
                            Table #{t.number} ({t.seats} Seats)
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={handleMoveOrder}
                      disabled={!moveTargetTable}
                      className="bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white px-4 py-2 rounded font-bold cursor-pointer"
                    >
                      Move
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
