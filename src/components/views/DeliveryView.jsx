import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  Truck,
  MapPin,
  Phone,
  User,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  Navigation,
  DollarSign,
  Tag,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function DeliveryView() {
  const { orders, foods, staff, addOrder, updateOrderStatus } = useRestaurant();

  // New Delivery Order Form State
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [address, setAddress] = useState('');
  const [mapLocation, setMapLocation] = useState('Lat 42.36, Long -71.05');
  const [landmark, setLandmark] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [assignedRider, setAssignedRider] = useState('David K. (Rider #04)');
  const [couponCode, setCouponCode] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(5.00);

  // Cart
  const [cart, setCart] = useState([
    { foodId: 'food-5', name: 'Cinder Smash Burger', price: 22.00, qty: 2, mod: 'Extra bacon' }
  ]);
  const [menuSearch, setMenuSearch] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = couponCode.toUpperCase() === 'WELCOME10' ? 6.20 : 0;
  const gstAmount = subtotal * 0.05;
  const grandTotal = Math.max(0, subtotal + gstAmount + deliveryFee - discountAmount);

  const handleAddToCart = (food) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.foodId === food.id);
      if (existing) {
        return prev.map((i) => (i.foodId === food.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { foodId: food.id, name: food.name, price: food.price, qty: 1, mod: '' }];
    });
  };

  const handleQtyChange = (foodId, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.foodId === foodId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const handleCreateDeliveryOrder = () => {
    if (!custName || !custPhone || !address || cart.length === 0) return;

    const orderId = `DEL-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: orderId,
      type: 'Delivery',
      tableNumber: '-',
      guests: 1,
      customerName: custName,
      customerPhone: custPhone,
      deliveryAddress: address,
      mapLocation,
      landmark,
      deliveryNotes,
      deliveryPartner: assignedRider,
      status: 'Order Received', // Order Received, Accepted, Preparing, Packed, Out for Delivery, Delivered, Cancelled
      kdsStatus: 'New',
      timeElapsed: '1m',
      createdAt: new Date().toISOString(),
      items: cart,
      couponCode,
      deliveryCharges: deliveryFee,
      gstAmount,
      discountAmount,
      totalAmount: grandTotal,
      paymentMethod: 'Cash',
      isPaid: false
    };

    addOrder(newOrder);
    setCart([]);
    setCustName('');
    setCustPhone('');
    setAddress('');
    setLandmark('');
  };

  const deliveryOrders = orders.filter((o) => o.type === 'Delivery');

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Banner */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Delivery Order Module</h2>
            <p className="text-[#94a3b8]">Live order dispatch, customer location mapping & rider assignment</p>
          </div>
        </div>

        <span className="bg-[#3b82f6]/10 text-[#3b82f6] px-3.5 py-1.5 rounded-lg font-bold border border-[#3b82f6]/30">
          {deliveryOrders.length} Delivery Orders
        </span>
      </div>

      {/* Grid: Order Dispatcher & Live Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Dispatcher Form & Cart (5 cols) */}
        <div className="lg:col-span-5 bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-[#334155] pb-3 flex items-center justify-between">
            <span>NEW DELIVERY ORDER</span>
            <span className="text-xs text-[#3b82f6] font-mono">STEP 1 OF 2</span>
          </h3>

          {/* Customer Details */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white text-xs">Customer Details</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Customer Name *"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-2 outline-none"
              />
              <input
                type="text"
                placeholder="Phone Number *"
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-2 outline-none"
              />
            </div>

            <input
              type="text"
              placeholder="Full Delivery Address *"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-2 outline-none"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Landmark (e.g. Near Park Gate)"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-2 outline-none"
              />
              <input
                type="text"
                placeholder="Map Coordinates"
                value={mapLocation}
                onChange={(e) => setMapLocation(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-2 outline-none"
              />
            </div>

            <input
              type="text"
              placeholder="Delivery Instructions / Driver Notes"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-2 outline-none"
            />
          </div>

          {/* Assign Delivery Partner */}
          <div className="space-y-1.5 border-t border-[#334155] pt-3">
            <label className="block text-[#94a3b8] font-semibold">Assign Delivery Partner</label>
            <select
              value={assignedRider}
              onChange={(e) => setAssignedRider(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-2 outline-none font-semibold"
            >
              {staff
                .filter((s) => s.role === 'Delivery Partner' || s.role === 'Staff' || s.role === 'Manager')
                .map((s) => (
                  <option key={s.id} value={`${s.name} (Rider)`}>
                    {s.name} ({s.role})
                  </option>
                ))}
            </select>
          </div>

          {/* Cart & Coupon Code */}
          <div className="border-t border-[#334155] pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span>SELECTED ITEMS ({cart.length})</span>
            </div>

            {cart.map((item) => (
              <div key={item.foodId} className="bg-[#0f172a] p-2 rounded border border-[#334155] flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{item.name}</p>
                  <p className="text-[11px] text-[#3b82f6]">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleQtyChange(item.foodId, -1)} className="text-[#94a3b8] hover:text-white p-1">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-white">{item.qty}</span>
                  <button onClick={() => handleQtyChange(item.foodId, 1)} className="text-[#94a3b8] hover:text-white p-1">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculation */}
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] space-y-1.5 text-xs">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Coupon Code (e.g. WELCOME10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-[#1e293b] border border-[#334155] text-white rounded px-2 py-1 uppercase"
              />
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>Delivery Fee:</span>
              <span>+${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>GST (5%):</span>
              <span>+${gstAmount.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#10b981] font-bold">
                <span>Discount Code:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-white border-t border-[#334155] pt-1.5">
              <span>Total Bill:</span>
              <span className="text-[#10b981]">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCreateDeliveryOrder}
            disabled={cart.length === 0}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2 cursor-pointer shadow-md"
          >
            <Truck className="w-4 h-4" />
            <span>Dispatch Delivery Order</span>
          </button>
        </div>

        {/* Live Delivery Tracking Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Menu Selection List */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 space-y-3 shadow-xl">
            <h3 className="text-base font-bold text-white">ADD FOOD TO DELIVERY</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {foods.slice(0, 3).map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleAddToCart(food)}
                  className="bg-[#0f172a] border border-[#334155] hover:border-[#3b82f6] p-2.5 rounded-lg cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white text-xs">{food.name}</p>
                    <p className="text-[11px] text-[#10b981] font-bold">${food.price.toFixed(2)}</p>
                  </div>
                  <Plus className="w-4 h-4 text-[#3b82f6]" />
                </div>
              ))}
            </div>
          </div>

          {/* Live Delivery Tracking Pipeline Cards */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-[#334155] pb-3">
              LIVE DELIVERY TRACKING PIPELINE
            </h3>

            <div className="space-y-4">
              {deliveryOrders.map((ord) => {
                const statuses = ['Order Received', 'Accepted', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'];
                const currentIndex = statuses.indexOf(ord.status);

                return (
                  <div key={ord.id} className="bg-[#0f172a] border border-[#334155] rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#334155] pb-2">
                      <div>
                        <span className="font-bold text-[#3b82f6]">{ord.id}</span>
                        <h4 className="text-sm font-bold text-white">{ord.customerName}</h4>
                      </div>
                      <div className="text-right">
                        <span className="bg-[#3b82f6]/20 text-[#3b82f6] px-2.5 py-0.5 rounded text-[11px] font-bold">
                          {ord.status}
                        </span>
                        <p className="text-[11px] text-[#94a3b8] mt-0.5">{ord.deliveryPartner}</p>
                      </div>
                    </div>

                    <div className="text-xs text-[#94a3b8] space-y-1">
                      <p className="flex items-center text-white"><MapPin className="w-3.5 h-3.5 text-[#ef4444] mr-1" /> {ord.deliveryAddress}</p>
                      <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1" /> {ord.customerPhone}</p>
                    </div>

                    {/* Progress Pipeline */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[10px] font-bold text-[#94a3b8] mb-1">
                        <span>Status Pipeline:</span>
                        <span className="text-[#10b981]">{ord.status}</span>
                      </div>
                      <div className="grid grid-cols-6 gap-1 font-mono text-[9px] text-center">
                        {statuses.map((st, i) => (
                          <button
                            key={st}
                            onClick={() => updateOrderStatus(ord.id, st, st === 'Delivered' ? 'Completed' : 'Ready')}
                            className={`py-1 rounded cursor-pointer ${
                              i <= currentIndex
                                ? 'bg-[#3b82f6] text-white font-bold'
                                : 'bg-[#1e293b] text-[#64748b] border border-[#334155]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
