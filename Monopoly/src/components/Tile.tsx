"use client";

import React from "react";
import type { OwnedProperty, Player, Tile as TileT } from "@/lib/types";
import { propertyGroups } from "@/lib/gameData";
import { isProperty } from "@/lib/rules";

// Emoji icons cho từng loại tile
const tileIcons: Record<string, string> = {
  GO: "🚀",
  INFRASTRUCTURE_CARD: "🏗️",
  SUPERSTRUCTURE_CARD: "📜",
  ECONOMIC_CRISIS: "⚠️",
  SOCIAL_WELFARE: "💝",
  GO_TO_CRISIS: "🚨",
  PROPERTY: "",
};

// Background gradient cho special tiles
const specialTileStyles: Record<string, string> = {
  GO: "from-emerald-50 to-teal-50 border-emerald-300",
  INFRASTRUCTURE_CARD: "from-amber-50 to-yellow-50 border-amber-300",
  SUPERSTRUCTURE_CARD: "from-purple-50 to-indigo-50 border-purple-300",
  ECONOMIC_CRISIS: "from-red-50 to-rose-50 border-red-300",
  SOCIAL_WELFARE: "from-pink-50 to-rose-50 border-pink-300",
  GO_TO_CRISIS: "from-orange-50 to-red-50 border-orange-300",
};

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

  const isSpecial = tile.type !== "PROPERTY";
  const specialStyle = isSpecial ? specialTileStyles[tile.type] : "";
  const icon = tileIcons[tile.type] || "";

  return (
    <div
      className={[
        "group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 bg-white transition-all duration-300",
        isActive
          ? "border-amber-400 ring-4 ring-amber-400/30 shadow-xl shadow-amber-400/20 scale-[1.02] z-10"
          : isFocused
            ? "border-indigo-400 ring-2 ring-indigo-400/20 shadow-lg z-10"
            : "border-slate-200 hover:border-indigo-300 hover:shadow-md hover:scale-[1.01]",
        isSpecial ? `bg-gradient-to-br ${specialStyle}` : "",
      ].join(" ")}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      {/* Property Color Band */}
      {group ? (
        <div className={`h-2.5 w-full ${group.colorClass}`} />
      ) : (
        <div className={`h-2.5 w-full ${isSpecial ? "bg-gradient-to-r from-slate-200 to-slate-300" : "bg-gradient-to-r from-slate-100 to-slate-200"}`} />
      )}

      <div className="flex flex-1 flex-col justify-between p-2">
        {/* Top row: Index + Icon */}
        <div className="flex items-start justify-between">
          <div className={[
            "text-2xl font-black tracking-tight tabular-nums transition-colors",
            isActive ? "text-amber-600" : "text-slate-800",
          ].join(" ")}>
            {tile.index}
          </div>
          {icon && (
            <span className="text-lg transition-transform group-hover:scale-110">{icon}</span>
          )}
        </div>

        {/* Tile Name - visible on hover */}
        <div className="mt-1 overflow-hidden">
          <div className={[
            "truncate text-[8px] font-semibold leading-tight transition-all duration-300",
            isActive ? "text-amber-700 opacity-100" : "text-slate-500 opacity-0 group-hover:opacity-100",
          ].join(" ")}>
            {tile.name}
          </div>
          {tile.type === "GO" && (
            <div className="text-[9px] font-bold text-emerald-600">START</div>
          )}
        </div>

        {/* Player Tokens */}
        {playersHere.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-0.5 pt-1">
            {playersHere.map((p, idx) => (
              <span
                key={p.id}
                className={[
                  "inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold shadow-sm transition-transform",
                  "hover:scale-110",
                ].join(" ")}
                style={{
                  backgroundColor: p.token.colorClass.includes("red") ? "#dc2626" :
                    p.token.colorClass.includes("gray") ? "#374151" :
                    p.token.colorClass.includes("blue") ? "#1d4ed8" :
                    p.token.colorClass.includes("green") ? "#15803d" :
                    p.token.colorClass.includes("pink") ? "#db2777" :
                    p.token.colorClass.includes("cyan") ? "#0891b2" : "#64748b",
                  color: "white",
                  zIndex: playersHere.length - idx,
                }}
              >
                {p.token.name.slice(0, 1)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hover Glow Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-indigo-500/0 to-indigo-500/0 transition-all duration-300 group-hover:from-indigo-500/5 group-hover:to-transparent" />

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50">
          <div className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-75" />
        </div>
      )}
    </div>
  );
}
