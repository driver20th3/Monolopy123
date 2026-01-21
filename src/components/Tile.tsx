"use client";

import React from "react";
import type { OwnedProperty, Player, Tile as TileT } from "@/lib/types";
import { propertyGroups } from "@/lib/gameData";
import { isProperty } from "@/lib/rules";

function groupColor(groupId: number) {
  return propertyGroups.find((g) => g.id === groupId)?.colorClass ?? "bg-zinc-300";
}

export function Tile(props: {
  tile: TileT;
  owned: OwnedProperty | null;
  playersHere: Player[];
  isActive: boolean;
}) {
  const { tile, owned, playersHere, isActive } = props;
  const prop = isProperty(tile) ? tile : null;
  const group = prop ? propertyGroups.find((g) => g.id === prop.groupId) : null;

  return (
    <div
      className={[
        "relative flex h-full w-full flex-col justify-between rounded-lg border bg-white p-2",
        isActive ? "border-zinc-900 ring-2 ring-zinc-900/10" : "border-zinc-200",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {group ? <span className={`h-2.5 w-2.5 rounded-full ${group.colorClass}`} /> : null}
          <div className="truncate text-[11px] font-semibold text-zinc-900">{tile.name}</div>
        </div>
        <div className="mt-1 text-[10px] text-zinc-500">
          {prop ? group?.name : tile.type}
        </div>
      </div>

      {prop ? (
        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="text-[10px] text-zinc-600">
            <div>Mua: {prop.price}</div>
            <div>Thuê: {prop.baseRent}</div>
          </div>
          <div className="text-right text-[10px] text-zinc-600">
            <div className="inline-flex items-center gap-1">
              <span className={`h-2 w-2 rounded ${groupColor(prop.groupId)}`} />
              <span>{prop.maxUpgrades} nâng</span>
            </div>
            {owned ? <div>Nâng: {owned.upgrades}</div> : <div>Chưa ai sở hữu</div>}
          </div>
        </div>
      ) : (
        <div className="mt-2 text-[10px] text-zinc-600 line-clamp-2">{tile.description ?? ""}</div>
      )}

      {playersHere.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {playersHere.map((p) => (
            <span
              key={p.id}
              className={[
                "inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium",
                p.token.colorClass,
              ].join(" ")}
            >
              {p.token.name}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

