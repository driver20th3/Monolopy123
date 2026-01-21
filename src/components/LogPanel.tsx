"use client";

import React from "react";
import type { LogEntry } from "@/lib/types";

export function LogPanel(props: { logs: LogEntry[] }) {
  const { logs } = props;
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900">Lịch sử</h3>
        <div className="text-xs text-zinc-500">Mới nhất trước</div>
      </div>
      <div className="mt-3 max-h-[340px] space-y-2 overflow-auto pr-1">
        {logs.length === 0 ? (
          <div className="rounded-xl bg-zinc-50 p-3 text-sm text-zinc-600">
            Chưa có sự kiện. Gieo xúc xắc để bắt đầu.
          </div>
        ) : (
          logs.map((l) => (
            <div key={l.id} className="rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700">
              <div className="text-xs text-zinc-500">Lượt {l.turn}</div>
              <div className="mt-1">{l.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

