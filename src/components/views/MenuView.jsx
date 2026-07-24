import React, { useState } from 'react';
import {
  Plus,
  ToggleLeft,
  ToggleRight,
  Filter,
  Clock,
  X
} from 'lucide-react';


const initialMenuItems = [
  { id: 'M1', name: 'Dry-Aged Ribeye 16oz', category: 'GRILL', price: '$68.00', prepTime: '18 min', available: true, description: '45-day dry aged beef, herb butter, smoked sea salt.' },
  { id: 'M2', name: 'Wood-Fired Bone Marrow', category: 'STARTERS', price: '$24.00', prepTime: '12 min', available: true, description: 'Roasted marrow canoes, grilled sourdough, parsley salad.' },
  { id: 'M3', name: 'Pan-Seared Sea Scallops', category: 'SAUTE', price: '$42.00', prepTime: '10 min', available: true, description: 'Hokkaido scallops, sweet corn puree, chorizo oil.' },
  { id: 'M4', name: 'Truffle Tagliatelle', category: 'SAUTE', price: '$38.00', prepTime: '14 min', available: true, description: 'Handmade tagliatelle, cultured butter, black truffle shavings.' },
  { id: 'M5', name: 'Cinder Smoked Smash Burger', category: 'PANTRY', price: '$22.00', prepTime: '8 min', available: true, description: 'Double wagyu smash patties, aged cheddar, tallow fries.' },
  { id: 'M6', name: 'Tomahawk Ribeye 32oz', category: 'GRILL', price: '$145.00', prepTime: '25 min', available: false, description: 'Prime long-bone ribeye carved tableside.' },
  { id: 'M7', name: 'Charred Broccolini', category: 'STARTERS', price: '$14.00', prepTime: '8 min', available: true, description: 'Chili garlic oil, lemon zest, toasted almonds.' },
  { id: 'M8', name: 'Smoked Dark Chocolate Fondant', category: 'DESSERTS', price: '$18.00', prepTime: '12 min', available: true, description: 'Valrhona dark chocolate, smoked sea salt gelato.' },
];

const categories = ['ALL', 'GRILL', 'SAUTE', 'STARTERS', 'PANTRY', 'DESSERTS'];

export default function MenuView({ searchQuery }) {
  const [items, setItems] = useState(initialMenuItems);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('GRILL');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemPrep] = useState('12 min');


  const toggleAvailability = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const newItem = {
      id: `M${items.length + 1}`,
      name: newItemName,
      category: newItemCategory,
      price: newItemPrice.startsWith('$') ? newItemPrice : `$${newItemPrice}`,
      prepTime: newItemPrep,
      available: true,
      description: 'Newly added chef special dish.'
    };
    setItems([newItem, ...items]);
    setNewItemName('');
    setNewItemPrice('');
    setShowAddModal(false);
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCount = items.filter((i) => i.available).length;
  const soldOutCount = items.length - activeCount;

  return (
    <div className="space-y-6 font-body">
      {/* Top Header Summary & Category Filter Tabs */}
      <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono">
          <div>
            <h3 className="font-header text-3xl text-white tracking-wider">KITCHEN MENU CATALOG</h3>
            <p className="text-xs text-[#a09a8e]">
              MANAGE DISH AVAILABILITY & KITCHEN STATION ASSIGNMENTS
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs bg-[#121110] px-3 py-1.5 rounded-lg border border-[#322e2a]">
              <span className="w-2 h-2 rounded-full bg-[#4caf50]" />
              <span className="text-[#4caf50] font-bold">{activeCount} IN STOCK</span>
            </div>
            {soldOutCount > 0 && (
              <div className="flex items-center space-x-2 text-xs bg-[#121110] px-3 py-1.5 rounded-lg border border-[#322e2a]">
                <span className="w-2 h-2 rounded-full bg-[#f44336]" />
                <span className="text-[#f44336] font-bold">{soldOutCount} 86'D</span>
              </div>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-ember px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ADD DISH</span>
            </button>
          </div>
        </div>

        {/* Category Tabs Row */}
        <div className="flex items-center space-x-2 pt-2 border-t border-[#322e2a] overflow-x-auto font-mono text-xs">
          <span className="text-[#6e675e] text-xs flex items-center space-x-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-[#ff4d25]" />
            <span>CATEGORY:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#ff4d25] text-white font-bold shadow-[0_0_12px_rgba(255,77,37,0.35)]'
                  : 'bg-[#121110] text-[#a09a8e] hover:text-white border border-[#322e2a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dish Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">

        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-[#1a1816] border rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all duration-200 ${
              item.available
                ? 'border-[#322e2a] hover:border-[#ff4d25]/40'
                : 'border-[#f44336]/40 opacity-75 bg-[#161412]'
            }`}
          >
            {/* Card Top: Category Badge & Prep Time */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ff4d25]/10 text-[#ff4d25] border border-[#ff4d25]/20 uppercase">
                  {item.category}
                </span>
                <span className="text-xs text-[#a09a8e] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-[#ff9800]" />
                  <span>{item.prepTime}</span>
                </span>
              </div>

              {/* Title & Price */}
              <h4 className="text-lg font-bold text-white leading-tight font-mono">{item.name}</h4>
              <p className="text-2xl font-bold text-[#ff9800] mt-1 font-mono">{item.price}</p>
              <p className="text-xs text-[#a09a8e] font-body mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Card Bottom: Toggle Switch */}
            <div className="pt-3 border-t border-[#322e2a] flex items-center justify-between">
              <span className={`text-xs font-bold ${item.available ? 'text-[#4caf50]' : 'text-[#f44336]'}`}>
                {item.available ? '● IN STOCK' : '○ 86\'D / SOLD OUT'}
              </span>

              <button
                type="button"
                onClick={() => toggleAvailability(item.id)}
                className="flex items-center space-x-1 cursor-pointer transition-colors"
                title={item.available ? 'Mark as Sold Out (86)' : 'Mark as In Stock'}
              >
                {item.available ? (
                  <ToggleRight className="w-8 h-8 text-[#4caf50]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-[#f44336]" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-body">
          <div className="w-full max-w-md bg-[#1a1816] border border-[#322e2a] rounded-xl p-6 shadow-2xl space-y-5 font-mono">
            <div className="flex items-center justify-between border-b border-[#322e2a] pb-3">
              <h3 className="font-header text-2xl text-white">ADD NEW CHEF DISH</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#6e675e] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a09a8e] mb-1">DISH NAME</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Wagyu Ribeye Skewer"
                  className="w-full bg-[#121110] border border-[#322e2a] focus:border-[#ff4d25] text-white rounded p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a09a8e] mb-1">CATEGORY</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full bg-[#121110] border border-[#322e2a] focus:border-[#ff4d25] text-white rounded p-2.5 outline-none"
                  >
                    {categories.filter((c) => c !== 'ALL').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#a09a8e] mb-1">PRICE ($)</label>
                  <input
                    type="text"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="34.00"
                    className="w-full bg-[#121110] border border-[#322e2a] focus:border-[#ff4d25] text-white rounded p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-[#121110] text-[#a09a8e] hover:text-white py-2.5 rounded border border-[#322e2a] cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-ember py-2.5 rounded font-bold cursor-pointer"
                >
                  ADD DISH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
