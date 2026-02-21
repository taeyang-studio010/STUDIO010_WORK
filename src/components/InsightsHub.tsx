"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useStorage, type KnowledgeItem, type AssetItem } from "@/features/storage/useStorage";
import { KnowledgeModal } from "@/components/KnowledgeModal";
import { AssetModal } from "@/components/AssetModal";

const KNOWLEDGE_TYPE: Record<KnowledgeItem["type"], string> = {
  reference: "시장 조사",
  webinar: "웨비나",
  meeting: "회의록",
};

export function InsightsHub() {
  const {
    knowledge,
    assets,
    createKnowledge,
    updateKnowledge,
    createAsset,
    updateAsset,
  } = useStorage();
  const [knowledgeModalOpen, setKnowledgeModalOpen] = useState(false);
  const [editingKnowledge, setEditingKnowledge] = useState<KnowledgeItem | null>(null);
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetItem | null>(null);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
      {/* 좌측 블록: 인사이트 · 지식 아카이빙 */}
      <section className="glass-panel-strong min-h-0 flex-1 rounded-xl border border-border p-5 transition-fluid lg:min-w-0">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="mb-1 text-sm font-medium text-text-secondary">
              인사이트 · 지식 아카이빙
            </h3>
            <p className="text-xs text-text-tertiary">
              시장 조사, 웨비나, 회의록
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingKnowledge(null);
              setKnowledgeModalOpen(true);
            }}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-[#0a0a0a] hover:bg-accent/90"
          >
            추가
          </button>
        </div>
        <ul className="space-y-2">
          {knowledge.map((item) => (
            <li
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setEditingKnowledge(item);
                setKnowledgeModalOpen(true);
              }}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (setEditingKnowledge(item), setKnowledgeModalOpen(true))
              }
              className={cn(
                "rounded-lg border border-border bg-white/[0.03] p-3 transition-fluid hover:border-border-strong hover:bg-white/[0.06] cursor-pointer"
              )}
            >
              <span className="text-xs text-accent">
                {KNOWLEDGE_TYPE[item.type]}
              </span>
              <p className="mt-0.5 font-medium text-white">{item.title}</p>
              {item.description && (
                <p className="mt-0.5 text-xs text-text-tertiary">
                  {item.description}
                </p>
              )}
              {item.date && (
                <p className="mt-1 text-xs text-text-tertiary">{item.date}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* 우측 블록: 에셋 볼트 */}
      <section className="glass-panel-strong min-h-0 flex-1 rounded-xl border border-border p-5 transition-fluid lg:min-w-0">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="mb-1 text-sm font-medium text-text-secondary">
              에셋 볼트
            </h3>
            <p className="text-xs text-text-tertiary">
              로고, 컬러, 폰트, IR 문서
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingAsset(null);
              setAssetModalOpen(true);
            }}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-[#0a0a0a] hover:bg-accent/90"
          >
            추가
          </button>
        </div>
        <ul className="space-y-2">
          {assets.map((item) => (
            <li
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setEditingAsset(item);
                setAssetModalOpen(true);
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && (setEditingAsset(item), setAssetModalOpen(true))
              }
              className={cn(
                "flex items-center gap-3 rounded-lg border border-border bg-white/[0.03] p-3 transition-fluid hover:border-border-strong hover:bg-white/[0.06] cursor-pointer"
              )}
            >
              {item.type === "color" && item.value && (
                <span
                  className="h-8 w-8 shrink-0 rounded-lg border border-border"
                  style={{ backgroundColor: item.value }}
                  aria-hidden
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{item.name}</p>
                {item.value && item.type !== "logo" && item.type !== "document" && (
                  <p className="font-mono text-xs text-accent">{item.value}</p>
                )}
                {item.description && (
                  <p className="text-xs text-text-tertiary">{item.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <KnowledgeModal
        open={knowledgeModalOpen}
        onClose={() => {
          setKnowledgeModalOpen(false);
          setEditingKnowledge(null);
        }}
        item={editingKnowledge}
        onSubmit={async (p) =>
          editingKnowledge
            ? updateKnowledge(editingKnowledge.id, p)
            : createKnowledge(p)
        }
      />
      <AssetModal
        open={assetModalOpen}
        onClose={() => {
          setAssetModalOpen(false);
          setEditingAsset(null);
        }}
        item={editingAsset}
        onSubmit={async (p) =>
          editingAsset ? updateAsset(editingAsset.id, p) : createAsset(p)
        }
      />
    </div>
  );
}
