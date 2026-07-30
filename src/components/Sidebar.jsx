import { db } from "@/lib/db";

import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag, ChefHat, History, Boxes, BarChart3, UtensilsCrossed,
  Users, Ticket, Settings, LogOut,
} from "lucide-react";

const NAV = [
  { to: "/order", label: "Order", Icon: ShoppingBag, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/kitchen", label: "Kitchen", Icon: ChefHat, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/history", label: "History", Icon: History, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/inventory", label: "Stock", Icon: Boxes, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/reports", label: "Reports", Icon: BarChart3, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/menu", label: "Menu", Icon: UtensilsCrossed, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/staff", label: "Staff", Icon: Users, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/promotions", label: "Offers", Icon: Ticket, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/settings", label: "Settings", Icon: Settings, roles: ["admin", "manager", "cashier", "kitchen"] },
];

const ROLE_HOME = { admin: "/order", manager: "/order", cashier: "/order", kitchen: "/kitchen" };
const ROLE_LABEL = { admin: "Admin", manager: "Manager", cashier: "Cashier", kitchen: "Kitchen" };

export default function Sidebar({ role, onRoleChange }) {
  const navigate = useNavigate();
  const items = NAV.filter((n) => n.roles.includes(role));

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[76px] flex flex-col items-center py-5 gap-1 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] z-30">
      <div className="w-11 h-11 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center mb-3 shadow-none">
        <span className="text-white text-xl">☕</span>
      </div>

      <nav className="flex-1 flex flex-col items-center gap-1.5 no-scrollbar overflow-y-auto">
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative w-12 h-12 rounded-xl flex flex-col items-center justify-center border-2 transition-colors ${
                isActive
                  ? "border-[#FF7A12] bg-[#FFF3EA] text-[#FF7A12]"
                  : "border-transparent text-[#8A8178] hover:bg-[hsl(var(--muted))]"
              }`
            }
          >
            <Icon size={20} strokeWidth={1.5} />
            <span className="text-[9px] mt-0.5 font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      <RoleSwitcher role={role} onRoleChange={(r) => { onRoleChange(r); navigate(ROLE_HOME[r] || "/order"); }} />

      <button
        onClick={() => alert("Session active")}
        className="w-12 h-12 rounded-xl flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
        title="Session Active"
      >
        <LogOut size={20} strokeWidth={1.5} />
      </button>
    </aside>
  );
}

function RoleSwitcher({ role, onRoleChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative mb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-12 h-7 rounded-lg border border-[#E7DFD7] text-[10px] font-medium text-[#8A8178] flex items-center justify-center"
      >
        {ROLE_LABEL[role]}
      </button>
      {open && (
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl py-1 w-20 z-50">
          {Object.keys(ROLE_LABEL).map((r) => (
            <button
              key={r}
              onClick={() => { onRoleChange(r); setOpen(false); }}
              className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-[hsl(var(--muted))] ${
                role === r ? "text-[#FF7A12] font-medium" : "text-[#2F241F]"
              }`}
            >
              {ROLE_LABEL[r]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}