"use client";

import React, { useMemo } from "react";
import type { OwnedProperty, Player, Tile as TileT } from "@/lib/types";
import { useGame } from "@/context/GameContext";
import { Tile } from "@/components/Tile";
import { Flashcard } from "@/components/Flashcard";
import { ControlPanel } from "@/components/ControlPanel";
import { StatsPanel } from "@/components/StatsPanel";
import { LogPanel } from "@/components/LogPanel";

type Coord = { x: number; y: number }; // 0..4

function perimeterCoords5x5(): Coord[] {
  // 16 coords clockwise starting at bottom-right corner.
  const coords: Coord[] = [];
  // bottom row (y=4): x 4..0
  for (let x = 4; x >= 0; x--) coords.push({ x, y: 4 });
  // left col (x=0): y 3..0
  for (let y = 3; y >= 0; y--) coords.push({ x: 0, y });
  // top row (y=0): x 1..4
  for (let x = 1; x <= 4; x++) coords.push({ x, y: 0 });
  // right col (x=4): y 1..3
  for (let y = 1; y <= 3; y++) coords.push({ x: 4, y });
  return coords; // length 16
}

function keyOf(c: Coord) {
  return `${c.x},${c.y}`;
}

export function Board() {
  const { state, tiles, closeModal } = useGame();
  const coords = useMemo(() => perimeterCoords5x5(), []);

  const tileByCoord = useMemo(() => {
    const map = new Map<string, TileT>();
    for (let i = 0; i < tiles.length; i++) {
      map.set(keyOf(coords[i]), tiles[i]);
    }
    return map;
  }, [coords, tiles]);

  const ownedByIndex = useMemo(() => {
    const map = new Map<number, OwnedProperty>();
    state.owned.forEach((o) => map.set(o.tileIndex, o));
    return map;
  }, [state.owned]);

  const playersAt = useMemo(() => {
    const map = new Map<number, Player[]>();
    state.players.forEach((p) => {
      const list = map.get(p.position) ?? [];
      list.push(p);
      map.set(p.position, list);
    });
    return map;
  }, [state.players]);

  const cellSize = 120; // px; used for token overlay positioning

  const tokenCoords = useMemo(() => {
    return state.players.map((p) => ({
      id: p.id,
      name: p.token.name,
      colorClass: p.token.colorClass,
      pos: p.position,
      coord: coords[p.position],
    }));
  }, [state.players, coords]);

  const flashTile =
    state.activeModal.kind === "tileFlashcard" ? tiles[state.activeModal.tileIndex] : null;
  const flashOwned =
    flashTile && state.activeModal.kind === "tileFlashcard"
      ? ownedByIndex.get(state.activeModal.tileIndex) ?? null
      : null;

  return (
    <div className="mx-auto w-full max-w-[1280px] p-6">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Marx-opoly</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Hạ tầng quyết định Thượng tầng — chơi 20 lượt, tối đa hóa giá trị ròng.
          </p>
        </div>
        <div className="text-sm text-zinc-700">
          Lượt: <span className="font-semibold">{state.turn}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_440px]">
        <div className="relative rounded-3xl border border-zinc-200 bg-zinc-100 p-3">
          <div
            className="relative grid rounded-2xl bg-zinc-100"
            style={{ gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "repeat(5, 1fr)" }}
          >
            {/* Render 25 cells. Perimeter gets tiles; center is a 3x3 panel area. */}
            {Array.from({ length: 25 }).map((_, i) => {
              const x = i % 5;
              const y = Math.floor(i / 5);
              const isCenter = x >= 1 && x <= 3 && y >= 1 && y <= 3;
              const t = tileByCoord.get(keyOf({ x, y })) ?? null;

              if (isCenter) {
                // empty cells; we'll overlay the center panel below
                return <div key={i} className="aspect-square p-1" />;
              }

              return (
                <div key={i} className="aspect-square p-1">
                  {t ? (
                    <Tile
                      tile={t}
                      owned={ownedByIndex.get(t.index) ?? null}
                      playersHere={playersAt.get(t.index) ?? []}
                      isActive={state.players[state.currentPlayerIndex].position === t.index}
                    />
                  ) : (
                    <div className="h-full w-full rounded-lg border border-dashed border-zinc-200 bg-white/70" />
                  )}
                </div>
              );
            })}

            {/* Center overlay */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur">
              <div className="pointer-events-auto grid h-full grid-cols-1 gap-3 p-3 md:grid-cols-1">
                <ControlPanel />
              </div>
            </div>

            {/* Token overlay for smooth transitions */}
            <div className="pointer-events-none absolute inset-0">
              {tokenCoords.map((t) => {
                const left = t.coord.x * cellSize + cellSize / 2;
                const top = t.coord.y * cellSize + cellSize / 2;
                return (
                  <div
                    key={t.id}
                    className="absolute transition-all duration-500 ease-in-out"
                    style={{ left, top, transform: "translate(-50%, -50%)" }}
                  >
                    <div
                      className={[
                        "flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-[10px] font-bold shadow-sm",
                        t.colorClass,
                      ].join(" ")}
                      title={t.name}
                    >
                      {t.name.slice(0, 1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 text-xs text-zinc-600">
            Lưu ý: di chuyển token dùng overlay transition đơn giản (MVP).
          </div>
        </div>

        <div className="space-y-4">
          <StatsPanel players={state.players} owned={state.owned} tiles={tiles} />
          <LogPanel logs={state.logs} />
        </div>
      </div>

      {flashTile ? (
        <Flashcard tile={flashTile} owned={flashOwned} onClose={closeModal} />
      ) : null}
    </div>
  );
}

