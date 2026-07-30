import React, { useState } from "react";
import { LogIn, LogOut, Wallet, Users, Clock } from "lucide-react";
import { STAFF } from "@/lib/cafeData";

export default function StaffShift() {
  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem("pos_staff");
    return saved ? JSON.parse(saved) : STAFF;
  });
  const [till, setTill] = useState(() => localStorage.getItem("pos_till") || "200.00");

  const persist = (next) => { setStaff(next); localStorage.setItem("pos_staff", JSON.stringify(next)); };
  const toggleClock = (id) => persist(staff.map((s) => (s.id === id ? { ...s, clockedIn: !s.clockedIn } : s)));

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
      <h1 className="text-[28px] font-medium mb-5">Staff & shifts</h1>

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
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => {
              const initials = s.name.split(" ").map((n) => n[0]).join("");
              const statusClass = s.clockedIn
                ? "bg-[#E3F0E7] text-[#3E7A4F]"
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
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleClock(s.id)} className={`h-8 px-3 rounded-[8px] border text-xs ${btnClass}`}>
                      {s.clockedIn ? "Clock out" : "Clock in"}
                    </button>
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
    </div>
  );
}