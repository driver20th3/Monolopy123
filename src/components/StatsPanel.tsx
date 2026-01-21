"use client";

import React, { useMemo } from "react";
import type { OwnedProperty, Player, Tile } from "@/lib/types";
import { isProperty } from "@/lib/rules";

function netWorth(player: Player, owned: OwnedProperty[], tiles: Tile[]) {
  const assets = owned
    .filter((o) => o.ownerId === player.id)
    .reduce((sum, o) => {
      const t = tiles[o.tileIndex];
      if (!t || t.type !== "PROPERTY") return sum;
      return sum + t.price + o.upgrades * t.buildCost;
    }, 0);
  return player.cash + assets;
}

export function StatsPanel(props: { players: Player[]; owned: OwnedProperty[]; tiles: Tile[] }) {
  const { players, owned, tiles } = props;

  const rows = useMemo(
    () =>
      players.map((p) => ({
        id: p.id,
        name: p.name,
        cash: p.cash,
        net: netWorth(p, owned, tiles),
        props: owned.filter((o) => o.ownerId === p.id).length,
        upgrades: owned
          .filter((o) => o.ownerId === p.id)
          .reduce((s, o) => s + o.upgrades, 0),
        skip: p.skipTurns,
        color: p.token.colorClass,
      })),
    [players, owned, tiles]
  );

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900">Người chơi</h3>
        <div className="text-xs text-zinc-500">MV & Giá trị ròng</div>
      </div>

      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="rounded-xl bg-zinc-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className={["truncate text-sm font-semibold", r.color].join(" ")}>{r.name}</div>
                <div className="mt-1 text-xs text-zinc-600">
                  Ô: {r.props} • Nâng cấp: {r.upgrades}
                  {r.skip > 0 ? ` • Bỏ lượt: ${r.skip}` : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-zinc-900">{r.cash} MV</div>
                <div className="text-xs text-zinc-600">Ròng: {r.net}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

