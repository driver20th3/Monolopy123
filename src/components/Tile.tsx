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
  isFocused?: boolean;
  onHover?: () => void;
  onClick?: () => void;
}) {
  const { tile, playersHere, isActive, isFocused, onHover, onClick } = props;
  const prop = isProperty(tile) ? tile : null;
  const group = prop ? propertyGroups.find((g) => g.id === prop.groupId) : null;

  return (
    <div
      className={[
        "relative flex h-full w-full cursor-pointer flex-col justify-between rounded-lg border bg-white p-2 transition",
        isActive
          ? "border-zinc-900 ring-2 ring-zinc-900/10 shadow-lg shadow-zinc-900/10"
          : isFocused
            ? "border-blue-500/60 ring-2 ring-blue-500/20"
            : "border-zinc-200 hover:border-blue-200 hover:shadow-sm",
      ].join(" ")}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <div className="min-w-0">
        <div className="flex items-center justify-end">
          {group ? <span className={`h-2.5 w-2.5 rounded-full ${group.colorClass}`} /> : null}
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold tracking-tight text-zinc-900 tabular-nums">
            {tile.index}
          </div>
          <div className="text-[10px] text-zinc-500">{tile.type === "GO" ? "START" : ""}</div>
        </div>
      </div>

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

