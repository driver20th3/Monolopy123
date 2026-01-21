"use client";

import React, { useMemo } from "react";
import type { OwnedProperty, Player, Tile } from "@/lib/types";
import { useSession } from "@/context/SessionContext";

export function StatsPanel(props: { players: Player[]; owned: OwnedProperty[]; tiles: Tile[] }) {
  const { players } = props;
  const { state: session } = useSession();

  const rows = useMemo(() => {
    return [...players]
      .map((p, idx) => {
        const s = session.players[idx] ?? session.players[0];
        return {
          id: p.id,
          name: s?.name || p.name,
          avatar: s?.avatar ?? null,
          color: s?.color ?? undefined,
          laps: p.laps,
          pos: p.position,
          skip: p.skipTurns,
          correct: p.correct,
          wrong: p.wrong,
          colorClass: p.token.colorClass,
        };
      })
      .sort((a, b) => {
        if (b.laps !== a.laps) return b.laps - a.laps;
        return b.pos - a.pos;
      });
  }, [players, session.players]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Xếp hạng</h3>
        <div className="text-xs text-slate-500">Live: Vòng → Vị trí</div>
      </div>

      <div className="mt-3 space-y-2">
        {rows.map((r, idx) => (
          <div key={r.id} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">#{idx + 1}</span>
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-[11px] font-semibold"
                    style={{ backgroundColor: r.color ?? undefined, color: r.color ? "#0f172a" : undefined }}
                  >
                    {r.avatar ?? r.name.slice(0, 1)}
                  </span>
                  <div className={["truncate text-sm font-semibold", r.colorClass].join(" ")}>{r.name}</div>
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Vòng: {r.laps} • Ô: {r.pos}
                  {r.skip > 0 ? ` • Bỏ lượt: ${r.skip}` : ""}
                  {" • "}
                  Đ/S: {r.correct ?? 0}/{r.wrong ?? 0}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-900">Ô hiện tại: {r.pos}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

