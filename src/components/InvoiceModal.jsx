import React, { useState } from 'react';
import { X, Printer, Download, QrCode, CheckCircle, CreditCard, DollarSign, Smartphone } from 'lucide-react';

export default function InvoiceModal({ order, onClose, onPaymentComplete }) {
  const [selectedPayment, setSelectedPayment] = useState(order?.paymentMethod || 'UPI');
  const [isPaid, setIsPaid] = useState(order?.isPaid || false);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCompletePayment = () => {
    setIsPaid(true);
    if (onPaymentComplete) {
      onPaymentComplete(order.id, selectedPayment);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans text-xs">
      <div className="w-full max-w-lg bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0f172a] px-6 py-4 border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-[#3b82f6]" />
            <h3 className="text-lg font-bold text-white">TAX INVOICE / BILL</h3>
          </div>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Printable Receipt Area */}
        <div className="p-6 overflow-y-auto space-y-4 bg-white text-[#0f172a] print:p-0 font-mono text-xs">
          {/* Restaurant Header */}
          <div className="text-center border-b border-dashed border-gray-300 pb-4 space-y-1">
            <h2 className="text-xl font-bold text-[#0f172a] uppercase tracking-wider">CINDER RESTAURANT & BAR</h2>
            <p className="text-[11px] text-gray-600">742 Evergreen Terrace, Downtown Plaza</p>
            <p className="text-[11px] text-gray-600">Phone: +1 (555) 019-2831 | GSTIN: 27AAAAA0000A1Z5</p>
            <div className="pt-2 text-[10px] text-gray-500 font-sans uppercase font-bold tracking-widest">
              OFFICIAL RECEIPT
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-dashed border-gray-300 pb-3">
            <div>
              <p>Invoice No: <strong>{order.id}</strong></p>
              <p>Type: <strong>{order.type}</strong></p>
              <p>Table #: <strong>{order.tableNumber || '-'}</strong></p>
            </div>
            <div className="text-right">
              <p>Date: {new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
              <p>Time: {new Date(order.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p>Customer: <strong>{order.customerName || 'Walk-in Guest'}</strong></p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-b border-dashed border-gray-300 pb-3">
            <thead>
              <tr className="border-b border-gray-300 text-gray-700 text-[10px] uppercase">
                <th className="py-1">Item</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Price</th>
                <th className="py-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-1.5 font-bold">
                    {item.name}
                    {item.mod && <span className="block text-[10px] text-gray-500 font-normal">({item.mod})</span>}
                  </td>
                  <td className="py-1.5 text-center font-bold">{item.qty}</td>
                  <td className="py-1.5 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-1.5 text-right font-bold">${(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Math */}
          <div className="space-y-1 text-right text-xs pt-1">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${(order.totalAmount - order.gstAmount + order.discountAmount).toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount:</span>
                <span>-${order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>GST (5%):</span>
              <span>+${order.gstAmount.toFixed(2)}</span>
            </div>
            {order.deliveryCharges > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee:</span>
                <span>+${order.deliveryCharges.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-gray-900 border-t border-b border-gray-300 py-1.5 mt-2">
              <span>GRAND TOTAL:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method & QR Code */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Payment Method</p>
              <p className="text-xs font-bold text-blue-600">{selectedPayment}</p>
              <p className={`text-[11px] font-bold ${isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isPaid ? '✓ PAID IN FULL' : '⏳ PAYMENT PENDING'}
              </p>
            </div>

            {/* Simulated UPI QR Code */}
            <div className="text-center bg-gray-50 p-2 rounded border border-gray-200">
              <QrCode className="w-12 h-12 text-gray-800 mx-auto" />
              <span className="text-[9px] text-gray-500 block mt-0.5">Scan UPI to Pay</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-gray-500 pt-2 border-t border-dashed border-gray-300">
            Thank you for dining with Cinder! Please visit again.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#0f172a] p-4 border-t border-[#334155] space-y-3 font-sans">
          {/* Payment Option Selector */}
          {!isPaid && (
            <div className="space-y-1.5">
              <label className="block text-xs text-[#94a3b8]">Select Payment Method</label>
              <div className="grid grid-cols-5 gap-1.5 font-mono text-[11px]">
                {['Cash', 'UPI', 'Card', 'Net Banking', 'Split'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedPayment(method)}
                    className={`py-1.5 rounded transition-all cursor-pointer ${
                      selectedPayment === method
                        ? 'bg-[#3b82f6] text-white font-bold'
                        : 'bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#334155]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {!isPaid ? (
              <button
                onClick={handleCompletePayment}
                className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white py-2.5 rounded-lg font-semibold flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Paid (${order.totalAmount.toFixed(2)})</span>
              </button>
            ) : (
              <button
                disabled
                className="flex-1 bg-[#10b981]/20 text-[#10b981] py-2.5 rounded-lg font-semibold flex items-center justify-center space-x-2 border border-[#10b981]/30"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Paid via {selectedPayment}</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2.5 rounded-lg font-semibold flex items-center space-x-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
