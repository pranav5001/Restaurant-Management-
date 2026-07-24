import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Package, AlertTriangle, Plus, Edit2, Trash2, ShieldAlert, CheckCircle, RefreshCw, X } from 'lucide-react';

export default function InventoryView() {
  const { inventory, setInventory, addAuditLog, addNotification } = useRestaurant();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [currentStock, setCurrentStock] = useState(10);
  const [minStock, setMinStock] = useState(5);
  const [unit, setUnit] = useState('kg');
  const [supplier, setSupplier] = useState('');
  const [costPerUnit, setCostPerUnit] = useState(10.0);

  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minStock);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setCurrentStock(10);
    setMinStock(5);
    setUnit('kg');
    setSupplier('');
    setCostPerUnit(10.0);
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setName(item.name);
    setCurrentStock(item.currentStock);
    setMinStock(item.minStock);
    setUnit(item.unit);
    setSupplier(item.supplier);
    setCostPerUnit(item.costPerUnit);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name) return;

    if (editingItem) {
      setInventory((prev) =>
        prev.map((i) =>
          i.id === editingItem.id ? { ...i, name, currentStock, minStock, unit, supplier, costPerUnit } : i
        )
      );
      addAuditLog(`Updated inventory stock for ${name}`);
    } else {
      const newItem = {
        id: `inv-${Date.now()}`,
        name,
        currentStock,
        minStock,
        unit,
        supplier: supplier || 'General Wholesaler',
        costPerUnit
      };
      setInventory((prev) => [...prev, newItem]);
      addAuditLog(`Added new ingredient ${name}`);
    }

    if (currentStock <= minStock) {
      addNotification('Low Stock Warning', `${name} is at or below minimum stock limit!`, 'warning');
    }

    setShowModal(false);
  };

  const handleDelete = (id, itemName) => {
    if (window.confirm(`Are you sure you want to delete ingredient "${itemName}"?`)) {
      setInventory((prev) => prev.filter((i) => i.id !== id));
      addAuditLog(`Deleted ingredient ${itemName}`);
    }
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Banner */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Inventory & Ingredient Stock</h2>
            <p className="text-[#94a3b8]">Track current stock levels, minimum stock alerts, suppliers & unit costs</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg font-bold flex items-center space-x-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Ingredient</span>
        </button>
      </div>

      {/* Automated Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/40 rounded-xl p-4 flex items-center justify-between text-[#ef4444]">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 animate-pulse flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm">AUTOMATED LOW STOCK ALERT ({lowStockItems.length} ITEMS)</h4>
              <p className="text-xs text-gray-300">
                The following ingredients are below minimum threshold: <strong>{lowStockItems.map((i) => i.name).join(', ')}</strong>
              </p>
            </div>
          </div>
          <span className="bg-[#ef4444] text-white px-3 py-1 rounded text-xs font-bold uppercase">
            Action Required
          </span>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0f172a] border-b border-[#334155] text-[#64748b] uppercase font-semibold">
              <th className="py-3 px-4">Ingredient Name</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Minimum Stock</th>
              <th className="py-3 px-4">Supplier</th>
              <th className="py-3 px-4">Unit Cost</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155] text-white">
            {inventory.map((item) => {
              const isLow = item.currentStock <= item.minStock;

              return (
                <tr key={item.id} className="hover:bg-[#0f172a]/50">
                  <td className="py-3.5 px-4 font-bold text-white">{item.name}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#3b82f6]">
                    {item.currentStock} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#94a3b8]">
                    {item.minStock} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 text-[#94a3b8]">{item.supplier}</td>
                  <td className="py-3.5 px-4 font-mono">${item.costPerUnit.toFixed(2)} / {item.unit}</td>
                  <td className="py-3.5 px-4">
                    {isLow ? (
                      <span className="bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 px-2.5 py-0.5 rounded font-bold text-[10px] uppercase">
                        ⚠ Low Stock
                      </span>
                    ) : (
                      <span className="bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 px-2.5 py-0.5 rounded font-bold text-[10px] uppercase">
                        ✓ Healthy
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="text-[#3b82f6] hover:bg-[#3b82f6]/10 p-1.5 rounded cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="text-[#ef4444] hover:bg-[#ef4444]/10 p-1.5 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'EDIT INGREDIENT' : 'ADD INGREDIENT'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#94a3b8] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#94a3b8] mb-1">Ingredient Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dry-Aged Beef"
                  className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[#94a3b8] mb-1">Current Stock</label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none font-bold text-[#3b82f6]"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Min Stock</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="kg / L / units"
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#94a3b8] mb-1">Supplier</label>
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Prime Meats Co."
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Cost / Unit ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(Number(e.target.value))}
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded p-2 outline-none"
                  />
                </div>
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
                  Save Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
