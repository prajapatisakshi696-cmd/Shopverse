"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED"] as const;

export default function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  const change = async (next: string) => {
    const prev = value;
    setValue(next); // optimistic update
    setSaving(true);

    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);

    if (!res.ok) {
      setValue(prev); // rollback
      alert("Could not update status");
      return;
    }
    router.refresh();
  };

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => change(e.target.value)}
      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}