"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

  return React.createElement(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-4",
      role: "dialog",
      "aria-modal": true,
      "aria-labelledby": "modal-title",
    },
    React.createElement("div", {
      className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
      onClick: onClose,
      "aria-hidden": true,
    }),
    React.createElement(
      "div",
      {
        className: cn(
          "glass-panel-strong relative w-full overflow-auto rounded-t-2xl border border-border p-6 shadow-xl",
          "max-h-[90vh] max-w-md md:rounded-2xl md:max-h-[90vh]",
          "min-h-[50vh] md:min-h-0",
          className
        ),
      },
      React.createElement(
        "div",
        { className: "mb-4 flex items-center justify-between" },
        React.createElement("h2", {
          id: "modal-title",
          className: "text-lg font-semibold text-white",
        }, title),
        React.createElement("button", {
          type: "button",
          onClick: onClose,
          className: "rounded-lg p-1 text-text-secondary hover:bg-white/10 hover:text-white",
          "aria-label": "닫기",
        }, "\u2715")
      ),
      children
    )
  );
}
