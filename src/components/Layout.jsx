import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { CartProvider } from "@/lib/CartContext";

export default function Layout() {
  const role = "admin";

  return (
    <CartProvider>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Sidebar />
        <main className="md:ml-[76px] min-h-screen pb-20 md:pb-0">
          <Outlet context={{ role }} />
        </main>
      </div>
    </CartProvider>
  );
}
