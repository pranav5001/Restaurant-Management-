import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { ShieldCheck, Clock, User, FileText } from 'lucide-react';

export default function AuditLogView() {
  const { auditLogs } = useRestaurant();

  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Security Audit Log</h2>
            <p className="text-[#94a3b8]">Immutable activity history of system actions, order edits & stock changes</p>
          </div>
        </div>

        <span className="bg-[#3b82f6]/10 text-[#3b82f6] px-3.5 py-1.5 rounded-lg font-bold border border-[#3b82f6]/30 font-mono">
          {auditLogs.length} LOGGED EVENTS
        </span>
      </div>

      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0f172a] border-b border-[#334155] text-[#64748b] uppercase font-semibold">
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">User / Staff</th>
              <th className="py-3 px-4">Action Performed</th>
              <th className="py-3 px-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155] text-white font-mono">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#0f172a]/50">
                <td className="py-3.5 px-4 font-bold text-[#3b82f6]">#LOG-{log.id}</td>
                <td className="py-3.5 px-4 font-sans font-bold text-white flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>{log.user}</span>
                </td>
                <td className="py-3.5 px-4 font-sans text-gray-200">{log.action}</td>
                <td className="py-3.5 px-4 text-right text-[#94a3b8]">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
