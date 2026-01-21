"use client";

import React from "react";
import type { LogEntry } from "@/lib/types";

export function LogPanel(props: { logs: LogEntry[] }) {
  const { logs } = props;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Lịch sử</h3>
        <div className="text-xs text-slate-500">Mới nhất trước</div>
      </div>
      <div className="mt-3 max-h-[320px] space-y-2 overflow-auto pr-1">
        {logs.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            Chưa có sự kiện. Gieo xúc xắc để bắt đầu.
          </div>
        ) : (
          logs.map((l) => (
            <div key={l.id} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-sm text-slate-700">
              <div className="text-xs font-semibold text-slate-500">Lượt {l.turn}</div>
              <div className="mt-1 leading-snug">{l.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

