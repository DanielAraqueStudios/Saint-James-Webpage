"use client";

import { useEffect, useState } from "react";
import { subscribe, dismissToast, type Toast } from "@/lib/toast";

const STYLES: Record<Toast["type"], string> = {
  error: "bg-red-600 border-red-400",
  success: "bg-green-600 border-green-400",
  info: "bg-gray-800 border-gray-600",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => subscribe(setToasts), []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${STYLES[t.type]} text-white text-sm rounded-lg border px-4 py-3 shadow-lg flex items-start justify-between gap-3`}
        >
          <span className="break-words">{t.message}</span>
          <button
            onClick={() => dismissToast(t.id)}
            className="text-white/70 hover:text-white leading-none"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
