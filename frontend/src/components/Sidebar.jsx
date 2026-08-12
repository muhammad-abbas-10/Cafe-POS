import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  Coffee, ShoppingBag, History, Boxes, BarChart3, UtensilsCrossed,
  Users, Settings, LogOut,
} from "lucide-react";

const NAV = [
  { to: "/order", label: "Order", Icon: ShoppingBag, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/history", label: "History", Icon: History, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/inventory", label: "Stock", Icon: Boxes, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/reports", label: "Reports", Icon: BarChart3, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/menu", label: "Menu", Icon: UtensilsCrossed, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/staff", label: "Staff", Icon: Users, roles: ["admin", "manager", "cashier", "kitchen"] },
  { to: "/settings", label: "Settings", Icon: Settings, roles: ["admin", "manager", "cashier", "kitchen"] },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const items = NAV.filter((n) => n.roles.includes("admin"));

  return (
    <>
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[76px] flex-col items-center py-5 gap-1 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] z-30">
      <div className="w-11 h-11 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center mb-3 shadow-none">
        <Coffee className="text-white" size={24} strokeWidth={1.8} aria-hidden="true" />
      </div>

      <nav className="flex-1 flex flex-col items-center gap-1.5 no-scrollbar overflow-y-auto">
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-colors ${
                isActive
                  ? "bg-[hsl(var(--primary))] text-white shadow-sm"
                  : "text-[#A89C8E] hover:bg-[hsl(var(--muted))]"
              }`
            }
          >
            <Icon size={20} strokeWidth={1.5} />
            <span className="text-[9px] mt-0.5 font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mb-1 w-12 h-7 rounded-lg border border-[#3A322C] text-[10px] font-medium text-[#A89C8E] flex items-center justify-center">
        Admin
      </div>

      <button
        type="button"
        onClick={logout}
        className="w-12 h-12 rounded-xl flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
        title="Log out"
        aria-label="Log out"
      >
        <LogOut size={20} strokeWidth={1.5} />
      </button>
    </aside>
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[hsl(var(--card))] border-t border-[hsl(var(--border))] z-30 flex items-center overflow-x-auto no-scrollbar">
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `shrink-0 flex flex-col items-center justify-center gap-0.5 w-16 h-full ${
              isActive ? "text-[hsl(var(--primary))]" : "text-[#A89C8E]"
            }`
          }
        >
          <Icon size={19} strokeWidth={1.5} />
          <span className="text-[9px] font-medium">{label}</span>
        </NavLink>
      ))}
      <button
        type="button"
        onClick={logout}
        className="shrink-0 flex flex-col items-center justify-center gap-0.5 w-16 h-full text-[#A89C8E]"
        aria-label="Log out"
      >
        <LogOut size={19} strokeWidth={1.5} />
        <span className="text-[9px] font-medium">Logout</span>
      </button>
    </nav>
    </>
  );
}
