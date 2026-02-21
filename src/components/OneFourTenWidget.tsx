"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useOneFourTen, type OneFourTenItem } from "@/features/oneFourTen/useOneFourTen";
import { OneFourTenItemModal } from "@/components/OneFourTenItemModal";

export function OneFourTenWidget() {
  const { items, addItem, updateItem, removeItem } = useOneFourTen();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OneFourTenItem | null>(null);

  const handleSubmit = async (payload: { step: string; title: string; description?: string }) => {
    if (editingItem) return updateItem(editingItem.id, payload);
    return addItem(payload);
  };

  return (
    <div className="glass-panel p-4 transition-fluid hover-lift">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-secondary">1 / 4 / 10 이번 주</h3>
        <button type="button" onClick={() => { setEditingItem(null); setModalOpen(true); }} className="min-h-[44px] rounded bg-accent/20 px-3 py-2 text-xs text-accent hover:bg-accent/30">+ 추가</button>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => { setEditingItem(item); setModalOpen(true); }}
            onKeyDown={(e) => e.key === "Enter" && (setEditingItem(item), setModalOpen(true))}
            className={cn(
              "rounded-lg border border-border bg-white/[0.02] p-3 transition-fluid cursor-pointer",
              "hover:border-border-strong hover:bg-white/[0.04]"
            )}
          >
            <span className="text-lg font-semibold text-accent">{item.step}</span>
            <p className="mt-0.5 text-sm font-medium text-white">{item.title}</p>
            <p className="text-xs text-text-tertiary">{item.description ?? ""}</p>
          </div>
        ))}
      </div>
      <OneFourTenItemModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingItem(null); }} item={editingItem} onSubmit={handleSubmit} onDelete={editingItem ? removeItem : undefined} />
    </div>
  );
}
