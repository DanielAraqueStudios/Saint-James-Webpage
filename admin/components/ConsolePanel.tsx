"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeLogs, clearLogs, type LogEntry } from "@/lib/logs";

const LEVEL_COLOR: Record<LogEntry["level"], string> = {
  info: "text-gray-400",
  success: "text-green-400",
  error: "text-red-400",
};

export function ConsolePanel() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeLogs(setLogs), []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ block: "end" });
  }, [logs, open]);

  const errorCount = logs.filter((l) => l.level === "error").length;

  return (
    <div className="fixed bottom-0 left-0 md:left-56 right-0 z-[90] font-mono text-xs">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-gray-900 border-t border-gray-800 text-gray-300 px-4 py-2 hover:bg-gray-800 transition-colors"
      >
        <span>
          Console {logs.length > 0 && `(${logs.length})`}
          {errorCount > 0 && <span className="ml-2 text-red-400">{errorCount} error{errorCount > 1 ? "s" : ""}</span>}
        </span>
        <span>{open ? "▼ hide" : "▲ show"}</span>
      </button>

      {open && (
        <div className="bg-black border-t border-gray-800 h-56 flex flex-col">
          <div className="flex justify-end px-3 py-1 border-b border-gray-900">
            <button
              onClick={clearLogs}
              className="text-gray-500 hover:text-white"
            >
              clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {logs.length === 0 && <p className="text-gray-600">No activity yet.</p>}
            {logs.map((l) => (
              <div key={l.id} className={LEVEL_COLOR[l.level]}>
                <span className="text-gray-600">[{l.time}]</span> {l.message}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </div>
  );
}
