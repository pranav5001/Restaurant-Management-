import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import InvoiceModal from '../InvoiceModal';
import { CreditCard, Printer, CheckCircle, Search, DollarSign, Download, Filter, Smartphone, Wallet, Building2 } from 'lucide-react';

export default function BillingView() {
  const { orders, updateOrderStatus } = useRestaurant();
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchFilter = filterType === 'ALL' || (filterType === 'PAID' ? o.isPaid : !o.isPaid);
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.tableNumber?.includes(search);
    return matchFilter && matchSearch;
  });

  const totalCollected = orders.filter((o) => o.isPaid).reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPending = orders.filter((o) => !o.isPaid).reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Banner */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Billing & Payment System</h2>
            <p className="text-[#94a3b8]">Generate tax invoices, manage payments (Cash, UPI, Card, Net Banking, Wallet, Split) & print bills</p>
          </div>
        </div>

        {/* Quick Math */}
        <div className="flex items-center space-x-4 font-mono">
          <div className="bg-[#0f172a] px-3.5 py-1.5 rounded-lg border border-[#334155]">
            <span className="text-[#94a3b8] text-[10px] block">TOTAL COLLECTED</span>
            <span className="text-base font-bold text-[#10b981]">${totalCollected.toFixed(2)}</span>
          </div>
          <div className="bg-[#0f172a] px-3.5 py-1.5 rounded-lg border border-[#334155]">
            <span className="text-[#94a3b8] text-[10px] block">PENDING BILLS</span>
            <span className="text-base font-bold text-[#f59e0b]">${totalPending.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex gap-2">
          {['ALL', 'PAID', 'PENDING'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-[#3b82f6] text-white shadow'
                  : 'bg-[#0f172a] text-[#94a3b8] hover:text-white border border-[#334155]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748b]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice #, customer, table..."
            className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] text-white rounded-lg pl-9 pr-3 py-1.5 outline-none"
          />
        </div>
      </div>

      {/* Orders Invoices Table */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0f172a] border-b border-[#334155] text-[#64748b] uppercase font-semibold">
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Customer / Table</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Grand Total</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155] text-white font-mono">
            {filteredOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#0f172a]/50">
                <td className="py-3.5 px-4 font-bold text-[#3b82f6]">{ord.id}</td>
                <td className="py-3.5 px-4 text-[#94a3b8]">{ord.type}</td>
                <td className="py-3.5 px-4 font-sans font-semibold">
                  {ord.customerName || 'Walk-in Guest'}
                  <span className="block text-[10px] text-[#94a3b8] font-mono">
                    {ord.type === 'Dine-In' ? `Table #${ord.tableNumber}` : 'Delivery'}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#0f172a] px-2.5 py-1 rounded border border-[#334155] text-[#3b82f6] font-bold">
                    {ord.paymentMethod || 'UPI'}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  {ord.isPaid ? (
                    <span className="bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 px-2.5 py-0.5 rounded font-bold text-[10px] uppercase">
                      ✓ Paid
                    </span>
                  ) : (
                    <span className="bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30 px-2.5 py-0.5 rounded font-bold text-[10px] uppercase">
                      ⏳ Pending
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#10b981] text-sm">
                  ${ord.totalAmount.toFixed(2)}
                </td>
                <td className="py-3.5 px-4 text-right space-x-2 font-sans">
                  <button
                    onClick={() => setActiveInvoiceOrder(ord)}
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-3 py-1.5 rounded-lg font-bold inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Bill</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {activeInvoiceOrder && (
        <InvoiceModal
          order={activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
          onPaymentComplete={(id, method) => {
            updateOrderStatus(id, 'Completed', 'Completed');
            setActiveInvoiceOrder(null);
          }}
        />
      )}
    </div>
  );
}
