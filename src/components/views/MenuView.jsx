import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Archive,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Flame,
  Star,
  X
} from 'lucide-react';

export default function MenuView({ searchQuery }) {
  const { foods, setFoods, categories, addAuditLog } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  // Food Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [subCategory, setSubCategory] = useState('Entrees');
  const [price, setPrice] = useState(25.00);
  const [offerPrice, setOfferPrice] = useState(20.00);
  const [prepTime, setPrepTime] = useState('15 min');
  const [calories, setCalories] = useState('450 kcal');
  const [isVeg, setIsVeg] = useState(false);
  const [spicyLevel, setSpicyLevel] = useState(1);
  const [available, setAvailable] = useState(true);
  const [recommended, setRecommended] = useState(false);
  const [chefSpecial, setChefSpecial] = useState(false);
  const [ingredients, setIngredients] = useState('Fresh herbs, salt, spices');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?w=300');

  const filteredFoods = foods.filter((f) => {
    const matchCat = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchSearch = !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingFood(null);
    setName('');
    setDescription('');
    setCategory('Main Course');
    setSubCategory('Entrees');
    setPrice(25.00);
    setOfferPrice(20.00);
    setPrepTime('15 min');
    setCalories('450 kcal');
    setIsVeg(false);
    setSpicyLevel(1);
    setAvailable(true);
    setRecommended(false);
    setChefSpecial(false);
    setIngredients('Fresh ingredients');
    setImage('https://images.unsplash.com/photo-1544025162-d76694265947?w=300');
    setShowModal(true);
  };

  const handleOpenEdit = (food) => {
    setEditingFood(food);
    setName(food.name);
    setDescription(food.description);
    setCategory(food.category);
    setSubCategory(food.subCategory || 'Entrees');
    setPrice(food.price);
    setOfferPrice(food.offerPrice || food.price);
    setPrepTime(food.prepTime || '15 min');
    setCalories(food.calories || '450 kcal');
    setIsVeg(food.isVeg);
    setSpicyLevel(food.spicyLevel || 1);
    setAvailable(food.available);
    setRecommended(food.recommended || false);
    setChefSpecial(food.chefSpecial || false);
    setIngredients(Array.isArray(food.ingredients) ? food.ingredients.join(', ') : food.ingredients || '');
    setImage(food.image);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name) return;

    const ingArray = typeof ingredients === 'string' ? ingredients.split(',').map((s) => s.trim()) : ingredients;

    if (editingFood) {
      setFoods((prev) =>
        prev.map((f) =>
          f.id === editingFood.id
            ? {
                ...f,
                name,
                description,
                category,
                subCategory,
                price,
                offerPrice,
                prepTime,
                calories,
                isVeg,
                spicyLevel,
                available,
                recommended,
                chefSpecial,
                ingredients: ingArray,
                image
              }
            : f
        )
      );
      addAuditLog(`Updated food item ${name}`);
    } else {
      const newFood = {
        id: `food-${Date.now()}`,
        name,
        description,
        category,
        subCategory,
        price,
        offerPrice,
        prepTime,
        calories,
        isVeg,
        spicyLevel,
        available,
        recommended,
        chefSpecial,
        ingredients: ingArray,
        stockStatus: 'In Stock',
        image: image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300'
      };
      setFoods((prev) => [...prev, newFood]);
      addAuditLog(`Added food item ${name}`);
    }
    setShowModal(false);
  };

  const handleDuplicate = (food) => {
    const dup = {
      ...food,
      id: `food-${Date.now()}`,
      name: `${food.name} (Copy)`
    };
    setFoods((prev) => [...prev, dup]);
    addAuditLog(`Duplicated food item ${food.name}`);
  };

  const handleDelete = (id, foodName) => {
    if (window.confirm(`Are you sure you want to delete food item "${foodName}"?`)) {
      setFoods((prev) => prev.filter((f) => f.id !== id));
      addAuditLog(`Deleted food item ${foodName}`);
    }
  };

  const toggleAvailability = (id) => {
    setFoods((prev) =>
      prev.map((f) => (f.id === id ? { ...f, available: !f.available } : f))
    );
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Header */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Food Menu Management Panel</h2>
            <p className="text-[#94a3b8]">Add, edit, duplicate, archive food items, pricing, prep times & stock status</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg font-bold flex items-center space-x-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            selectedCategory === 'ALL'
              ? 'bg-[#3b82f6] text-white shadow'
              : 'bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#334155]'
          }`}
        >
          ALL DISHES ({foods.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.name)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === c.name
                ? 'bg-[#3b82f6] text-white shadow'
                : 'bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#334155]'
            }`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className={`bg-[#1e293b] border rounded-xl overflow-hidden shadow-lg flex flex-col justify-between transition-all ${
              food.available ? 'border-[#334155] hover:border-[#3b82f6]' : 'border-[#ef4444]/40 opacity-70'
            }`}
          >
            <div className="relative h-32 bg-[#0f172a] overflow-hidden">
              <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 flex gap-1">
                <span className="bg-[#0f172a]/80 text-[#3b82f6] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                  {food.category}
                </span>
                {food.chefSpecial && (
                  <span className="bg-amber-500 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                    ★ CHEF SPECIAL
                  </span>
                )}
              </div>
              <span
                className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  food.isVeg ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {food.isVeg ? 'VEG' : 'NON-VEG'}
              </span>
            </div>

            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white text-sm leading-tight">{food.name}</h4>
                <p className="text-[11px] text-[#94a3b8] mt-0.5 line-clamp-2">{food.description}</p>

                <div className="flex items-center gap-2 mt-2 font-mono text-[11px]">
                  <span className="text-[#10b981] font-bold text-sm">${food.price.toFixed(2)}</span>
                  {food.offerPrice && food.offerPrice < food.price && (
                    <span className="text-[#94a3b8] line-through">${food.offerPrice.toFixed(2)}</span>
                  )}
                  <span className="text-[#94a3b8] ml-auto">⏱ {food.prepTime || '15m'}</span>
                </div>
              </div>

              {/* Card Bottom Actions */}
              <div className="pt-2 border-t border-[#334155] flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleAvailability(food.id)}
                  className={`px-2 py-0.5 rounded font-bold text-[10px] cursor-pointer ${
                    food.available
                      ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                      : 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30'
                  }`}
                >
                  {food.available ? 'IN STOCK (86 OFF)' : 'SOLD OUT (86)'}
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDuplicate(food)}
                    title="Duplicate Food"
                    className="p-1 text-[#94a3b8] hover:text-white cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(food)}
                    title="Edit Food"
                    className="p-1 text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(food.id, food.name)}
                    title="Delete Food"
                    className="p-1 text-[#ef4444] hover:bg-[#ef4444]/10 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Food Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingFood ? 'EDIT FOOD ITEM' : 'ADD NEW FOOD ITEM'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#94a3b8] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#94a3b8] mb-1">Food Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Truffle Tagliatelle"
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ingredients and prep notes..."
                  className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[#94a3b8] mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none font-bold text-[#10b981]"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Offer Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="15 min"
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Calories</label>
                  <input
                    type="text"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="450 kcal"
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#0f172a] p-2.5 rounded border border-[#334155]">
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVeg}
                    onChange={(e) => setIsVeg(e.target.checked)}
                    className="rounded"
                  />
                  <span>Is Veg?</span>
                </label>
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recommended}
                    onChange={(e) => setRecommended(e.target.checked)}
                    className="rounded"
                  />
                  <span>Recommended</span>
                </label>
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chefSpecial}
                    onChange={(e) => setChefSpecial(e.target.checked)}
                    className="rounded"
                  />
                  <span>Chef Special</span>
                </label>
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1">Food Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
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
                  Save Food Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
