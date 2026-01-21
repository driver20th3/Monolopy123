"use client";

import React from "react";
import type { OwnedProperty, Tile } from "@/lib/types";
import { propertyGroups } from "@/lib/gameData";
import { isProperty } from "@/lib/rules";

function groupName(groupId: number) {
  return propertyGroups.find((g) => g.id === groupId)?.name ?? "Unknown Group";
}

export function Flashcard(props: {
  tile: Tile;
  owned: OwnedProperty | null;
  onClose: () => void;
}) {
  const { tile, owned, onClose } = props;
  const isProp = isProperty(tile);
  const group = isProp ? propertyGroups.find((g) => g.id === tile.groupId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 p-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {group ? <span className={`h-3 w-3 rounded-full ${group.colorClass}`} /> : null}
              <h3 className="truncate text-lg font-semibold text-zinc-900">{tile.name}</h3>
            </div>
            <p className="mt-1 text-sm text-zinc-600">
              {isProp ? groupName(tile.groupId) : tile.type}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            OK
          </button>
        </div>

        <div className="p-4">
          {tile.description ? <p className="text-sm text-zinc-700">{tile.description}</p> : null}

          {isProp ? (
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-zinc-50 p-3">
                <div className="text-zinc-500">Giá mua</div>
                <div className="font-semibold text-zinc-900">{tile.price} MV</div>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3">
                <div className="text-zinc-500">Chi phí nâng</div>
                <div className="font-semibold text-zinc-900">{tile.buildCost} MV</div>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3">
                <div className="text-zinc-500">Thuê cơ bản</div>
                <div className="font-semibold text-zinc-900">{tile.baseRent} MV</div>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3">
                <div className="text-zinc-500">Số nâng cấp</div>
                <div className="font-semibold text-zinc-900">
                  {owned ? owned.upgrades : 0}/{tile.maxUpgrades}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700">
              <div className="text-zinc-500">Hành động</div>
              <div className="mt-1">{tile.description ?? "—"}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

