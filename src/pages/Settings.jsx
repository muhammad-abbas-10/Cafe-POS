import React, { useState } from "react";
import { Percent, Clock, Printer, ShieldCheck, Save } from "lucide-react";

export default function Settings() {
  const [taxRate, setTaxRate] = useState(() => localStorage.getItem("pos_tax") || "8");
  const [bizName, setBizName] = useState(() => localStorage.getItem("pos_biz_name") || "Your Café Name");
  const [bizAddress, setBizAddress] = useState(() => localStorage.getItem("pos_biz_address") || "1234 Main Street, Your City");
  const [bizPhone, setBizPhone] = useState(() => localStorage.getItem("pos_biz_phone") || "123-456-7890");
  const [deliveryFee, setDeliveryFee] = useState(() => localStorage.getItem("pos_delivery_fee") || "3.50");
  const [hours, setHours] = useState(() => localStorage.getItem("pos_hours") || "7:00 – 22:00");
  const [printer, setPrinter] = useState(() => localStorage.getItem("pos_printer") || "Star TSP143 (USB)");
  const [saved, setSaved] = useState(false);

  const save = () => {
    localStorage.setItem("pos_tax", taxRate);
    localStorage.setItem("pos_biz_name", bizName);
    localStorage.setItem("pos_biz_address", bizAddress);
    localStorage.setItem("pos_biz_phone", bizPhone);
    localStorage.setItem("pos_delivery_fee", deliveryFee);
    localStorage.setItem("pos_hours", hours);
    localStorage.setItem("pos_printer", printer);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-8 py-7 max-w-2xl">
      <h1 className="text-[28px] font-medium mb-5">Settings</h1>

      <Section icon={Printer} title="Receipt header">
        <div className="space-y-2">
          <input value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="Business name" className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" />
          <input value={bizAddress} onChange={(e) => setBizAddress(e.target.value)} placeholder="Address" className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" />
          <input value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} placeholder="Phone" className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" />
        </div>
      </Section>

      <Section icon={Percent} title="Tax rate">
        <div className="flex items-center gap-2">
          <input type="number" step="0.1" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-24 h-10 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" />
          <span className="text-sm text-[hsl(var(--muted-foreground))]">% applied to every order subtotal</span>
        </div>
      </Section>

      <Section icon={Percent} title="Delivery fee">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[hsl(var(--muted-foreground))]">$</span>
          <input type="number" step="0.5" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} className="w-24 h-10 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" />
          <span className="text-sm text-[hsl(var(--muted-foreground))]">flat fee added to delivery orders</span>
        </div>
      </Section>

      <Section icon={Clock} title="Business hours">
        <input value={hours} onChange={(e) => setHours(e.target.value)} className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" />
      </Section>

      <Section icon={Printer} title="Printer & hardware">
        <select value={printer} onChange={(e) => setPrinter(e.target.value)} className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm bg-transparent">
          <option>Star TSP143 (USB)</option>
          <option>Epson TM-m30 (Bluetooth)</option>
          <option>Star TSP654 (LAN)</option>
          <option>No printer (digital receipts only)</option>
        </select>
        <button className="mt-2 h-9 px-3 rounded-[8px] border border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))]">Test print</button>
      </Section>

      <Section icon={ShieldCheck} title="Security & PCI">
        <div className="space-y-2 text-xs text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#6FCB86]" /> Card data handled by payment processor — never stored locally.</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#6FCB86]" /> Role-based access enforced across all screens.</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#6FCB86]" /> All stock & price changes are audit-logged.</div>
        </div>
      </Section>

      <button onClick={save} className="h-10 px-4 rounded-[10px] bg-[hsl(var(--primary))] text-white text-sm font-medium flex items-center gap-2 mt-2">
        <Save size={16} strokeWidth={1.5} /> {saved ? "Saved" : "Save settings"}
      </button>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5 mb-4">
      <div className="flex items-center gap-2 mb-3"><Icon size={16} strokeWidth={1.5} className="text-[hsl(var(--accent))]" /><span className="text-sm font-medium">{title}</span></div>
      {children}
    </div>
  );
}
