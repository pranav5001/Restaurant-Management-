import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import InvoiceModal from '../InvoiceModal';
import {
  Utensils,
  Plus,
  Minus,
  Trash2,
  Send,
  Printer,
  Save,
  XCircle,
  Search,
  CheckCircle,
  Clock,
  User,
  Phone,
  MessageSquare
} from 'lucide-react';

export default function DineInView() {
  const { foods, categories, tables, orders, addOrder, updateOrderStatus, staff } = useRestaurant();

  // Dine-in order drawer / form state
  const [selectedTable, setSelectedTable] = useState('01');
  const [guestsCount, setGuestsCount] = useState(2);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [waiterName, setWaiterName] = useState('Marco S.');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Menu selection & Cart
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [menuSearch, setMenuSearch] = useState('');
  const [cartItems, setCartItems] = useState([
    { foodId: 'food-1', name: 'Dry-Aged Ribeye 16oz', price: 68.00, qty: 1, mod: 'Medium Rare' }
  ]);
  const [discountAmount, setDiscountAmount] = useState(5.00);

  // Active Selected Order for Printing / Payment
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  // Filtered menu
  const filteredFoods = foods.filter((f) => {
    const matchCat = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchSearch = !menuSearch || f.name.toLowerCase().includes(menuSearch.toLowerCase());
    return matchCat && matchSearch && f.available;
  });

  // Cart math
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstAmount = subtotal * 0.05; // 5% GST
  const grandTotal = Math.max(0, subtotal + gstAmount - discountAmount);

  const handleAddToCart = (food) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.foodId === food.id);
      if (existing) {
        return prev.map((i) => (i.foodId === food.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { foodId: food.id, name: food.name, price: food.price, qty: 1, mod: '' }];
    });
  };

  const handleQtyChange = (foodId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.foodId === foodId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleSendToKitchen = () => {
    if (cartItems.length === 0) return;
    const orderId = `ORD-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: orderId,
      type: 'Dine-In',
      tableNumber: selectedTable,
      guests: guestsCount,
      customerName: customerName || 'Walk-in Guest',
      customerPhone,
      waiterName,
      status: 'Pending',
      kdsStatus: 'New', // Sent to KDS immediately
      timeElapsed: '1m',
      createdAt: new Date().toISOString(),
      specialInstructions,
      items: cartItems,
      gstAmount,
      discountAmount,
      totalAmount: grandTotal,
      paymentMethod: 'UPI',
      isPaid: false
    };

    addOrder(newOrder);
    setCartItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setSpecialInstructions('');
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Banner */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Dine-In Management Module</h2>
            <p className="text-[#94a3b8]">Create new table requests, customize orders, send directly to KDS</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-[#10b981]/10 text-[#10b981] px-3 py-1.5 rounded-lg font-semibold border border-[#10b981]/30">
            {tables.filter((t) => t.status === 'Available').length} Tables Available
          </span>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Order Builder & Cart (5 cols) */}
        <div className="lg:col-span-5 bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-[#334155] pb-3">
            NEW DINE-IN ORDER REQUEST
          </h3>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[#94a3b8] mb-1">Select Table Number</label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] text-white rounded-lg p-2 outline-none font-semibold"
              >
                {tables.map((tbl) => (
                  <option key={tbl.id} value={tbl.number}>
                    Table #{tbl.number} ({tbl.seats} Seats - {tbl.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#94a3b8] mb-1">Guests</label>
              <input
                type="number"
                min="1"
                max="20"
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-[#94a3b8] mb-1">Customer Name (Optional)</label>
              <input
                type="text"
                placeholder="Guest Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-[#94a3b8] mb-1">Mobile # (Optional)</label>
              <input
                type="text"
                placeholder="+1 555-0199"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-2 outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[#94a3b8] mb-1">Waiter Selection</label>
              <select
                value={waiterName}
                onChange={(e) => setWaiterName(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-2 outline-none"
              >
                {staff
                  .filter((s) => s.role === 'Waiter' || s.role === 'Manager')
                  .map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.role})
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-[#94a3b8] mb-1">Special Instructions</label>
              <input
                type="text"
                placeholder="e.g. Mild spicy, allergy note..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg p-2 outline-none"
              />
            </div>
          </div>

          {/* Cart Table */}
          <div className="border-t border-[#334155] pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span>ORDER ITEMS ({cartItems.length})</span>
              <button
                onClick={() => setCartItems([])}
                className="text-[#ef4444] hover:underline text-[11px] cursor-pointer"
              >
                Clear Cart
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-[#0f172a] border border-dashed border-[#334155] rounded-lg p-6 text-center text-[#64748b]">
                No items added yet. Select from menu on the right.
              </div>
            ) : (
              <div className="bg-[#0f172a] rounded-lg border border-[#334155] divide-y divide-[#334155] max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.foodId} className="p-2.5 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-[#3b82f6]">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Qty Controls */}
                    <div className="flex items-center space-x-1.5 bg-[#1e293b] px-2 py-1 rounded border border-[#334155]">
                      <button
                        onClick={() => handleQtyChange(item.foodId, -1)}
                        className="text-[#94a3b8] hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-white px-1">{item.qty}</span>
                      <button
                        onClick={() => handleAddToCart({ id: item.foodId })}
                        className="text-[#94a3b8] hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleQtyChange(item.foodId, -item.qty)}
                      className="text-[#ef4444] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Math Summary */}
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#94a3b8]">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>GST (5%):</span>
              <span>+${gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#94a3b8] items-center">
              <span>Discount ($):</span>
              <input
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                className="w-16 bg-[#1e293b] border border-[#334155] text-white text-right rounded px-1 py-0.5"
              />
            </div>
            <div className="flex justify-between text-base font-bold text-white border-t border-[#334155] pt-1.5">
              <span>Total Amount:</span>
              <span className="text-[#10b981]">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 font-semibold">
            <button
              onClick={handleSendToKitchen}
              disabled={cartItems.length === 0}
              className="bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white py-2.5 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Send to Kitchen</span>
            </button>

            <button
              onClick={() => {
                if (cartItems.length > 0) {
                  const dummyOrd = {
                    id: 'DRAFT',
                    type: 'Dine-In',
                    tableNumber: selectedTable,
                    customerName: customerName || 'Walk-in Guest',
                    createdAt: new Date().toISOString(),
                    items: cartItems,
                    gstAmount,
                    discountAmount,
                    totalAmount: grandTotal,
                    paymentMethod: 'UPI',
                    isPaid: false
                  };
                  setActiveInvoiceOrder(dummyOrd);
                }
              }}
              disabled={cartItems.length === 0}
              className="bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white py-2.5 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill</span>
            </button>
          </div>
        </div>

        {/* Right Side: Menu Picker & Active Orders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Menu Category & Search Header */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-bold text-white">FOOD MENU CATALOG</h3>
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748b]" />
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Search food name..."
                  className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] text-white text-xs rounded-lg pl-9 pr-3 py-1.5 outline-none"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#3b82f6] text-white font-bold'
                    : 'bg-[#0f172a] text-[#94a3b8] hover:text-white border border-[#334155]'
                }`}
              >
                ALL
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.name
                      ? 'bg-[#3b82f6] text-white font-bold'
                      : 'bg-[#0f172a] text-[#94a3b8] hover:text-white border border-[#334155]'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                onClick={() => handleAddToCart(food)}
                className="bg-[#1e293b] border border-[#334155] hover:border-[#3b82f6] rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="relative h-28 overflow-hidden bg-[#0f172a]">
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#0f172a]/80 text-[#3b82f6] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                    {food.category}
                  </span>
                  <span
                    className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      food.isVeg ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {food.isVeg ? 'VEG' : 'NON-VEG'}
                  </span>
                </div>

                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs leading-snug">{food.name}</h4>
                    <p className="text-[11px] text-[#94a3b8] line-clamp-1">{food.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#334155] pt-2">
                    <span className="text-sm font-bold text-[#10b981]">${food.price.toFixed(2)}</span>
                    <button className="bg-[#3b82f6] text-white p-1 rounded hover:bg-[#2563eb]">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Dine-In Orders Table */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white border-b border-[#334155] pb-3">
              ACTIVE DINE-IN ORDERS STATUS
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#334155] text-[#64748b] uppercase">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Table</th>
                    <th className="py-2.5 px-3">Waiter</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]">
                  {orders
                    .filter((o) => o.type === 'Dine-In')
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#0f172a]/50">
                        <td className="py-3 px-3 font-bold text-[#3b82f6]">{ord.id}</td>
                        <td className="py-3 px-3 font-bold text-white">TBL #{ord.tableNumber}</td>
                        <td className="py-3 px-3 text-[#94a3b8]">{ord.waiterName}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.status === 'Completed'
                                ? 'badge-success'
                                : ord.status === 'Ready'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'badge-warning'
                            }`}
                          >
                            {ord.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-white">${ord.totalAmount.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            onClick={() => setActiveInvoiceOrder(ord)}
                            className="bg-[#3b82f6] text-white px-2 py-1 rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Bill
                          </button>
                          {ord.status !== 'Completed' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'Completed', 'Completed')}
                              className="bg-[#10b981] text-white px-2 py-1 rounded text-[11px] font-semibold cursor-pointer"
                            >
                              Done
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Printing Modal */}
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
