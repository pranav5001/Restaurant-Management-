import React, { useState } from 'react';
import {
  ChefHat,
  ToggleLeft,
  ToggleRight,
  UserPlus,
  X
} from 'lucide-react';


const initialStaffMembers = [
  { id: 'S1', name: 'Chef Marco Rossi', role: 'Head Chef / Expeditor', station: 'PASS', shift: '15:00 - 23:00', onDuty: true, hours: '6.5 hrs' },
  { id: 'S2', name: 'Elena Rostova', role: 'Sous Chef', station: 'SAUTE', shift: '16:00 - 24:00', onDuty: true, hours: '5.5 hrs' },
  { id: 'S3', name: 'David Kim', role: 'Grill Master', station: 'GRILL', shift: '15:30 - 23:30', onDuty: true, hours: '6.0 hrs' },
  { id: 'S4', name: 'Sarah Miller', role: 'Pantry Chef', station: 'PANTRY', shift: '16:30 - 22:30', onDuty: true, hours: '5.0 hrs' },
  { id: 'S5', name: 'Antoine Dubois', role: 'Pastry Chef', station: 'PASTRY', shift: '08:00 - 16:00', onDuty: false, hours: '8.0 hrs' },
  { id: 'S6', name: 'Marcus Vance', role: 'Head Sommelier', station: 'FLOOR', shift: '17:00 - 23:00', onDuty: true, hours: '4.5 hrs' },
  { id: 'S7', name: 'Sophia Lin', role: 'Lead Expeditor', station: 'PASS', shift: '11:00 - 19:00', onDuty: false, hours: '8.0 hrs' },
];

export default function StaffView({ searchQuery }) {
  const [staffList, setStaffList] = useState(initialStaffMembers);
  const [showAddModal, setShowAddModal] = useState(false);

  // New staff form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Line Cook');
  const [newStation, setNewStation] = useState('GRILL');
  const [newShift, setNewShift] = useState('16:00 - 24:00');

  const toggleDuty = (id) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, onDuty: !s.onDuty } : s))
    );
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newName) return;
    const newMember = {
      id: `S${staffList.length + 1}`,
      name: newName,
      role: newRole,
      station: newStation,
      shift: newShift,
      onDuty: true,
      hours: '0.0 hrs'
    };
    setStaffList([newMember, ...staffList]);
    setNewName('');
    setShowAddModal(false);
  };

  const filteredStaff = staffList.filter((s) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.role.toLowerCase().includes(query) ||
      s.station.toLowerCase().includes(query)
    );
  });

  const onDutyCount = staffList.filter((s) => s.onDuty).length;
  const offDutyCount = staffList.length - onDutyCount;

  return (
    <div className="space-y-6 font-body">
      {/* Top Header Roster Summary */}
      <div className="bg-[#1a1816] border border-[#322e2a] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 font-mono shadow-xl">
        <div>
          <h3 className="font-header text-3xl text-white tracking-wider">KITCHEN CREW ROSTER</h3>
          <p className="text-xs text-[#a09a8e]">ACTIVE SHIFT MANAGEMENT & STATION DUTY STATUS</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs bg-[#121110] px-3.5 py-1.5 rounded-lg border border-[#322e2a]">
            <span className="w-2 h-2 rounded-full bg-[#4caf50] animate-pulse" />
            <span className="text-[#4caf50] font-bold">{onDutyCount} ON DUTY</span>
          </div>
          <div className="flex items-center space-x-2 text-xs bg-[#121110] px-3.5 py-1.5 rounded-lg border border-[#322e2a]">
            <span className="w-2 h-2 rounded-full bg-[#6e675e]" />
            <span className="text-[#a09a8e] font-bold">{offDutyCount} OFF DUTY</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-ember px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center space-x-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>ADD CREW MEMBER</span>
          </button>
        </div>
      </div>

      {/* Staff Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {filteredStaff.map((staff) => (
          <div
            key={staff.id}
            className={`bg-[#1a1816] border rounded-xl p-5 flex items-center justify-between shadow-md transition-all duration-200 ${
              staff.onDuty
                ? 'border-[#322e2a] hover:border-[#ff4d25]/40'
                : 'border-[#322e2a]/40 opacity-70 bg-[#161412]'
            }`}
          >
            <div className="flex items-center space-x-4 min-w-0">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  staff.onDuty
                    ? 'bg-[#ff4d25]/10 border border-[#ff4d25]/30 text-[#ff4d25]'
                    : 'bg-[#221f1c] border border-[#322e2a] text-[#6e675e]'
                }`}
              >
                <ChefHat className="w-6 h-6" />
              </div>

              <div className="min-w-0">
                <h4 className="text-base font-bold text-white leading-tight truncate">{staff.name}</h4>
                <p className="text-xs text-[#ff9800] mt-0.5">{staff.role}</p>
                <p className="text-[11px] text-[#a09a8e] mt-1">
                  Station: <strong>{staff.station}</strong> | Shift: {staff.shift}
                </p>
              </div>
            </div>

            <div className="text-right space-y-2 flex-shrink-0 ml-4">
              <span
                className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  staff.onDuty ? 'badge-herb' : 'bg-[#221f1c] text-[#6e675e] border border-[#322e2a]'
                }`}
              >
                {staff.onDuty ? '● ON DUTY' : '○ OFF DUTY'}
              </span>

              <div>
                <button
                  type="button"
                  onClick={() => toggleDuty(staff.id)}
                  className="flex items-center space-x-1 justify-end text-xs cursor-pointer hover:text-white transition-colors"
                  title={staff.onDuty ? 'Set to Off Duty' : 'Set to On Duty'}
                >
                  {staff.onDuty ? (
                    <ToggleRight className="w-8 h-8 text-[#4caf50]" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-[#6e675e]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Staff Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-body">
          <div className="w-full max-w-md bg-[#1a1816] border border-[#322e2a] rounded-xl p-6 shadow-2xl space-y-5 font-mono">
            <div className="flex items-center justify-between border-b border-[#322e2a] pb-3">
              <h3 className="font-header text-2xl text-white">ADD CREW MEMBER</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#6e675e] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a09a8e] mb-1">STAFF NAME</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Chef Matteo Ricci"
                  className="w-full bg-[#121110] border border-[#322e2a] focus:border-[#ff4d25] text-white rounded p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a09a8e] mb-1">ROLE / POSITION</label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Line Cook / Saute Chef"
                  className="w-full bg-[#121110] border border-[#322e2a] focus:border-[#ff4d25] text-white rounded p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a09a8e] mb-1">STATION</label>
                  <select
                    value={newStation}
                    onChange={(e) => setNewStation(e.target.value)}
                    className="w-full bg-[#121110] border border-[#322e2a] focus:border-[#ff4d25] text-white rounded p-2.5 outline-none"
                  >
                    {['PASS', 'GRILL', 'SAUTE', 'PANTRY', 'PASTRY', 'FLOOR'].map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#a09a8e] mb-1">SHIFT HOURS</label>
                  <input
                    type="text"
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    placeholder="16:00 - 24:00"
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
                  ADD CREW
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
