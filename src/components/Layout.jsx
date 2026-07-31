import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { CartProvider } from "@/lib/CartContext";

export default function Layout() {
  const [role, setRole] = useState(() => localStorage.getItem("pos_role") || "admin");

  useEffect(() => {
    localStorage.setItem("pos_role", role);
  }, [role]);

  return (
    <CartProvider>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Sidebar role={role} onRoleChange={setRole} />
        <main className="md:ml-[76px] min-h-screen pb-20 md:pb-0">
          <Outlet context={{ role }} />
        </main>
      </div>
    </CartProvider>
  );
}
