import React, { useState } from "react";
import { LogOut, Wallet, Users, Clock, Plus, Pencil, Trash2, X } from "lucide-react";
import { STAFF } from "@/lib/cafeData";

export default function StaffShift() {
  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem("pos_staff");
    return saved ? JSON.parse(saved) : STAFF;
  });
  const [till, setTill] = useState(() => localStorage.getItem("pos_till") || "200.00");
  const [editing, setEditing] = useState(null);

  const persist = (next) => { setStaff(next); localStorage.setItem("pos_staff", JSON.stringify(next)); };
  const toggleClock = (id) => persist(staff.map((s) => (s.id === id ? { ...s, clockedIn: !s.clockedIn } : s)));
  const removeStaff = (id) => {
    const member = staff.find((entry) => entry.id === id);
    if (member && !confirm(`Delete ${member.name}?`)) return;
    persist(staff.filter((entry) => entry.id !== id));
  };
  const saveStaff = (member) => {
    persist(staff.some((entry) => entry.id === member.id) ? staff.map((entry) => (entry.id === member.id ? member : entry)) : [...staff, member]);
    setEditing(null);
  };

  const clocked = staff.filter((s) => s.clockedIn);
  const totalOrders = staff.reduce((sum, s) => sum + (s.ordersHandled || 0), 0);

  const reconcile = () => {
    localStorage.setItem("pos_till", till);
    setTillMsg(true);
    setTimeout(() => setTillMsg(false), 2000);
  };
  const [tillMsg, setTillMsg] = useState(false);

  return (
    <div className="px-8 py-7">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[28px] font-medium">Staff & shifts</h1>
        <button onClick={() => setEditing({ id: "st-" + Date.now(), name: "", role: "Cashier", shift: "", clockedIn: false, ordersHandled: 0 })} className="h-10 px-4 rounded-[10px] bg-[hsl(var(--primary))] text-white text-sm font-medium flex items-center gap-1.5"><Plus size={16} strokeWidth={1.5} /> Add staff</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5">
          <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] mb-2"><Users size={16} strokeWidth={1.5} /><span className="text-xs">Clocked in</span></div>
          <div className="text-[22px] font-medium text-[hsl(var(--primary))]">{clocked.length}</div>
        </div>
        <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5">
          <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] mb-2"><Clock size={16} strokeWidth={1.5} /><span className="text-xs">Orders handled</span></div>
          <div className="text-[22px] font-medium text-[hsl(var(--primary))]">{totalOrders}</div>
        </div>
        <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5">
          <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] mb-2"><Wallet size={16} strokeWidth={1.5} /><span className="text-xs">Till opening</span></div>
          <input value={till} onChange={(e) => setTill(e.target.value)} className="text-[22px] font-medium text-[hsl(var(--primary))] bg-transparent w-28 outline-none" />
        </div>
      </div>

      <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] overflow-hidden mb-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[12px] text-[hsl(var(--muted-foreground))] border-b border-[hsl(var(--border))]">
              <th className="px-4 py-3 font-medium">Staff</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Shift</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => {
              const initials = s.name.split(" ").map((n) => n[0]).join("");
              const statusClass = s.clockedIn
                ? "bg-[#173321] text-[#6FCB86]"
                : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]";
              const btnClass = s.clockedIn
                ? "border-[hsl(var(--border))]"
                : "border-[hsl(var(--primary))] text-[hsl(var(--primary))]";
              return (
                <tr key={s.id} className="border-b border-[hsl(var(--border))] last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center text-xs font-medium text-[hsl(var(--accent))]">{initials}</div>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{s.role}</td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{s.shift}</td>
                  <td className="px-4 py-3">{s.ordersHandled}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full ${statusClass}`}>{s.clockedIn ? "On shift" : "Off"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditing(s)} className="w-8 h-8 rounded-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]" title="Edit"><Pencil size={14} strokeWidth={1.5} /></button>
                      <button onClick={() => removeStaff(s.id)} className="w-8 h-8 rounded-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]" title="Delete"><Trash2 size={14} strokeWidth={1.5} /></button>
                      <button onClick={() => toggleClock(s.id)} className={`h-8 px-3 rounded-[8px] border text-xs ${btnClass}`}>{s.clockedIn ? "Clock out" : "Clock in"}</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center gap-3">
        {tillMsg && <span className="text-xs text-[hsl(var(--accent))]">Till reconciled.</span>}
        <button onClick={reconcile} className="h-10 px-4 rounded-[10px] bg-[hsl(var(--primary))] text-white text-sm font-medium flex items-center gap-2">
          <LogOut size={16} strokeWidth={1.5} /> Reconcile till
        </button>
      </div>
      {editing && <StaffEditor staffMember={editing} onClose={() => setEditing(null)} onSave={saveStaff} />}
    </div>
  );
}

function StaffEditor({ staffMember, onClose, onSave }) {
  const [form, setForm] = useState(staffMember);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[hsl(var(--card))] w-full max-w-sm rounded-[12px] border border-[hsl(var(--border))] p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><div className="text-sm font-medium">{staffMember.name ? "Edit staff member" : "New staff member"}</div><button onClick={onClose}><X size={18} strokeWidth={1.5} /></button></div>
        <div className="space-y-3">
          <div><label className="text-[13px] text-[hsl(var(--muted-foreground))]">Name</label><input value={form.name} onChange={(event) => set("name", event.target.value)} className="w-full h-10 mt-1 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" /></div>
          <div><label className="text-[13px] text-[hsl(var(--muted-foreground))]">Role</label><select value={form.role} onChange={(event) => set("role", event.target.value)} className="w-full h-10 mt-1 px-2 rounded-[8px] border border-[hsl(var(--border))] text-sm bg-transparent text-[hsl(var(--foreground))]"><option style={{ backgroundColor: "#fff", color: "#2F241F" }}>Manager</option><option style={{ backgroundColor: "#fff", color: "#2F241F" }}>Cashier</option><option style={{ backgroundColor: "#fff", color: "#2F241F" }}>Kitchen</option></select></div>
          <div><label className="text-[13px] text-[hsl(var(--muted-foreground))]">Shift</label><input value={form.shift} onChange={(event) => set("shift", event.target.value)} placeholder="e.g. Open 7:00 – 15:00" className="w-full h-10 mt-1 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" /></div>
        </div>
        <div className="flex gap-2 mt-4"><button onClick={onClose} className="flex-1 h-10 rounded-[8px] border border-[hsl(var(--border))] text-sm">Cancel</button><button onClick={() => onSave(form)} className="flex-1 h-10 rounded-[8px] bg-[hsl(var(--primary))] text-white text-sm">Save</button></div>
      </div>
    </div>
  );
}
