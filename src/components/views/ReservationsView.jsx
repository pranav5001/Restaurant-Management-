import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Calendar, Plus, Users, Clock, CheckCircle2, XCircle, Phone, User, MessageSquare, X } from 'lucide-react';

export default function ReservationsView() {
  const { reservations, setReservations, addAuditLog } = useRestaurant();
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(4);
  const [date, setDate] = useState('2026-07-25');
  const [time, setTime] = useState('19:30');
  const [request, setRequest] = useState('');

  const handleAddReservation = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newRes = {
      id: `res-${Date.now()}`,
      name,
      phone,
      guests,
      date,
      time,
      request: request || 'No special requests',
      status: 'Confirmed'
    };

    setReservations((prev) => [newRes, ...prev]);
    addAuditLog(`Created table reservation for ${name} (${guests} guests)`);
    setName('');
    setPhone('');
    setRequest('');
    setShowModal(false);
  };

  const updateStatus = (id, newStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Banner */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Table Reservation System</h2>
            <p className="text-[#94a3b8]">Manage customer table bookings, party sizes, special requests & confirmation status</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg font-bold flex items-center space-x-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Reservation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.map((res) => (
          <div key={res.id} className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#334155] pb-2">
              <div>
                <h4 className="text-base font-bold text-white leading-tight">{res.name}</h4>
                <p className="text-[11px] text-[#94a3b8] flex items-center mt-0.5"><Phone className="w-3 h-3 mr-1" /> {res.phone}</p>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  res.status === 'Confirmed'
                    ? 'badge-success'
                    : res.status === 'Cancelled'
                    ? 'badge-danger'
                    : 'badge-warning'
                }`}
              >
                {res.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs bg-[#0f172a] p-2.5 rounded border border-[#334155]">
              <div>
                <span className="text-[#64748b] text-[10px] block">GUESTS</span>
                <span className="font-bold text-white">{res.guests} Seats</span>
              </div>
              <div>
                <span className="text-[#64748b] text-[10px] block">DATE</span>
                <span className="font-bold text-white">{res.date}</span>
              </div>
              <div>
                <span className="text-[#64748b] text-[10px] block">TIME</span>
                <span className="font-bold text-[#3b82f6]">{res.time}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#94a3b8] italic">
              Note: {res.request}
            </p>

            <div className="pt-2 border-t border-[#334155] flex gap-2 font-semibold">
              {res.status !== 'Completed' && (
                <button
                  onClick={() => updateStatus(res.id, 'Completed')}
                  className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white py-1.5 rounded flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Seated / Done</span>
                </button>
              )}
              {res.status !== 'Cancelled' && (
                <button
                  onClick={() => updateStatus(res.id, 'Cancelled')}
                  className="bg-[#0f172a] hover:bg-[#ef4444] text-[#94a3b8] hover:text-white px-3 py-1.5 rounded border border-[#334155] cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Reservation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <h3 className="text-lg font-bold text-white">NEW TABLE RESERVATION</h3>
              <button onClick={() => setShowModal(false)} className="text-[#94a3b8] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReservation} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#94a3b8] mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alexander Wright"
                  className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 901-2345"
                  className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[#94a3b8] mb-1">Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none font-bold text-[#3b82f6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1">Special Requests</label>
                <input
                  type="text"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder="Window seat, anniversary cake..."
                  className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-[#0f172a] text-[#94a3b8] hover:text-white py-2 rounded border border-[#334155]"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-[#3b82f6] text-white font-bold py-2 rounded">
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
