import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { QrCode, Smartphone, Plus, CheckCircle, Flame, Utensils } from 'lucide-react';

export default function CustomerQRMenuView() {
  const { foods, categories, addOrder } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [tableNumber, setTableNumber] = useState('04');
  const [customerCart, setCustomerCart] = useState([]);
  const [orderSent, setOrderSent] = useState(false);

  const filteredFoods = foods.filter((f) => selectedCategory === 'ALL' || f.category === selectedCategory);

  const handleAddToCart = (food) => {
    setCustomerCart((prev) => {
      const existing = prev.find((i) => i.foodId === food.id);
      if (existing) {
        return prev.map((i) => (i.foodId === food.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { foodId: food.id, name: food.name, price: food.price, qty: 1 }];
    });
  };

  const handlePlaceCustomerOrder = () => {
    if (customerCart.length === 0) return;
    const subtotal = customerCart.reduce((s, i) => s + i.price * i.qty, 0);
    const gst = subtotal * 0.05;
    const total = subtotal + gst;

    const newOrder = {
      id: `QR-${Math.floor(100 + Math.random() * 900)}`,
      type: 'Dine-In',
      tableNumber,
      guests: 2,
      customerName: 'Self-Ordered (QR)',
      waiterName: 'QR Self POS',
      status: 'Pending',
      kdsStatus: 'New',
      timeElapsed: '1m',
      createdAt: new Date().toISOString(),
      items: customerCart,
      gstAmount: gst,
      discountAmount: 0,
      totalAmount: total,
      paymentMethod: 'UPI',
      isPaid: false
    };

    addOrder(newOrder);
    setOrderSent(true);
    setCustomerCart([]);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Customer Digital QR Code Menu</h2>
            <p className="text-[#94a3b8]">Simulates mobile self-ordering when customers scan table QR codes</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center p-4">
        {/* Smartphone Shell Frame */}
        <div className="w-full max-w-sm bg-black border-4 border-gray-800 rounded-[32px] overflow-hidden shadow-2xl space-y-3 p-4 text-white font-sans border-t-8 border-b-8">
          {/* Top Speaker Bar */}
          <div className="w-24 h-4 bg-gray-800 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="w-8 h-1 bg-gray-600 rounded-full" />
          </div>

          {/* Restaurant Header */}
          <div className="text-center bg-[#1e293b] p-3 rounded-xl border border-[#334155]">
            <h3 className="text-lg font-bold text-white">Cinder Restaurant Menu</h3>
            <p className="text-[10px] text-[#3b82f6]">Table #{tableNumber} Self Order</p>
          </div>

          {orderSent && (
            <div className="bg-[#10b981]/20 border border-[#10b981] p-3 rounded-xl text-center text-[#10b981]">
              <CheckCircle className="w-6 h-6 mx-auto mb-1" />
              <p className="font-bold">Order Sent to Kitchen!</p>
              <p className="text-[10px]">Chef is preparing your meal.</p>
              <button
                onClick={() => setOrderSent(false)}
                className="mt-2 bg-[#10b981] text-white text-[10px] px-3 py-1 rounded font-bold"
              >
                Order More Items
              </button>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded-lg ${selectedCategory === 'ALL' ? 'bg-[#3b82f6] font-bold' : 'bg-[#1e293b]'}`}
            >
              ALL
            </button>
            {categories.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${selectedCategory === c.name ? 'bg-[#3b82f6] font-bold' : 'bg-[#1e293b]'}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Food Cards */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredFoods.map((f) => (
              <div key={f.id} className="bg-[#1e293b] p-2.5 rounded-xl border border-[#334155] flex items-center justify-between gap-2">
                <img src={f.image} alt={f.name} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs truncate">{f.name}</p>
                  <p className="text-[#10b981] font-bold text-xs">${f.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(f)}
                  className="bg-[#3b82f6] text-white p-1.5 rounded-lg hover:bg-[#2563eb]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Bar */}
          {customerCart.length > 0 && (
            <div className="bg-[#10b981] text-white p-3 rounded-xl font-bold flex items-center justify-between">
              <div>
                <p className="text-xs">{customerCart.reduce((s, i) => s + i.qty, 0)} Items</p>
                <p className="text-sm">${customerCart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}</p>
              </div>
              <button
                onClick={handlePlaceCustomerOrder}
                className="bg-white text-[#10b981] px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer"
              >
                Place Order ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
