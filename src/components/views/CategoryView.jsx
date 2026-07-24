import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Layers, Plus, Edit2, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Image, X } from 'lucide-react';

export default function CategoryView() {
  const { categories, setCategories, addAuditLog } = useRestaurant();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🍲');
  const [displayOrder, setDisplayOrder] = useState(categories.length + 1);
  const [image, setImage] = useState('');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('🍲');
    setDisplayOrder(categories.length + 1);
    setImage('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200');
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setIcon(cat.icon || '🍲');
    setDisplayOrder(cat.displayOrder || 1);
    setImage(cat.image);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, name, description, icon, displayOrder, image } : c))
      );
      addAuditLog(`Updated category ${name}`);
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name,
        description,
        icon,
        displayOrder,
        status: 'Active',
        image: image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200'
      };
      setCategories((prev) => [...prev, newCat]);
      addAuditLog(`Created category ${name}`);
    }
    setShowModal(false);
  };

  const handleDelete = (catId, catName) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      setCategories((prev) => prev.filter((c) => c.id !== catId));
      addAuditLog(`Deleted category ${catName}`);
    }
  };

  const toggleHide = (catId) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, status: c.status === 'Active' ? 'Hidden' : 'Active' } : c))
    );
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Header */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Food Category Management</h2>
            <p className="text-[#94a3b8]">Organize starters, mains, biryanis, drinks, desserts, and display order</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg font-bold flex items-center space-x-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`bg-[#1e293b] border rounded-xl overflow-hidden shadow-lg flex flex-col justify-between transition-all ${
              cat.status === 'Active' ? 'border-[#334155] hover:border-[#3b82f6]' : 'border-[#ef4444]/40 opacity-60'
            }`}
          >
            <div className="relative h-28 bg-[#0f172a] overflow-hidden">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-[#0f172a]/80 text-white font-bold text-sm px-2 py-0.5 rounded backdrop-blur flex items-center space-x-1">
                <span>{cat.icon}</span>
                <span>#{cat.displayOrder}</span>
              </span>
              <span
                className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                  cat.status === 'Active' ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white'
                }`}
              >
                {cat.status}
              </span>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white leading-tight flex items-center space-x-1">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </h4>
                <p className="text-[11px] text-[#94a3b8] mt-1 line-clamp-2">{cat.description}</p>
              </div>

              <div className="pt-3 border-t border-[#334155] flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleHide(cat.id)}
                  className="text-[#94a3b8] hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  {cat.status === 'Active' ? <Eye className="w-4 h-4 text-[#10b981]" /> : <EyeOff className="w-4 h-4 text-[#ef4444]" />}
                  <span>{cat.status === 'Active' ? 'Hide' : 'Unhide'}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-[#ef4444] hover:bg-[#ef4444]/10 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingCategory ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#94a3b8] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#94a3b8] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. South Indian"
                  className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Category tagline"
                  className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#94a3b8] mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="🍕"
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Display Order #</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1">Category Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
