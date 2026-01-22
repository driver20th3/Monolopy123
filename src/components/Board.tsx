"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { OwnedProperty, Player, Tile as TileT } from "@/lib/types";
import { useGame } from "@/context/GameContext";
import { useSession } from "@/context/SessionContext";
import { Tile } from "@/components/Tile";
import { Flashcard } from "@/components/Flashcard";
import { ControlPanel } from "@/components/ControlPanel";
import { StatsPanel } from "@/components/StatsPanel";
import { LogPanel } from "@/components/LogPanel";
import { QuestionModal } from "@/components/QuestionModal";
import { TileDetail } from "@/components/TileDetail";
import { MAX_TURNS, TARGET_LAPS } from "@/lib/gameData";
import { Crown, Trophy } from "lucide-react";

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
  const { state: session } = useSession();
  const coords = useMemo(() => perimeterCoords5x5(), []);
  const [focusIndex, setFocusIndex] = useState<number>(state.players[state.currentPlayerIndex].position);

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

  const tokenCoords = useMemo(() => {
    return state.players.map((p, idx) => {
      const s = session.players[idx] ?? session.players[0];
      return {
        id: p.id,
        name: s?.name || p.token.name,
        avatar: s?.avatar ?? null,
        colorHex: s?.color ?? null,
        colorClass: p.token.colorClass,
        pos: p.position,
        coord: coords[p.position],
      };
    });
  }, [state.players, coords, session.players]);

  useEffect(() => {
    // Sync focus with the active player's position when turn changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFocusIndex(state.players[state.currentPlayerIndex].position);
  }, [state.currentPlayerIndex, state.players]);

  const flashTile =
    state.activeModal.kind === "tileFlashcard" ? tiles[state.activeModal.tileIndex] : null;
  const flashOwned =
    flashTile && state.activeModal.kind === "tileFlashcard"
      ? ownedByIndex.get(state.activeModal.tileIndex) ?? null
      : null;

  const activeQuestion = state.activeModal.kind === "question" ? state.activeModal.question : null;
  const reachedTarget = state.players.some((p) => p.laps >= TARGET_LAPS);
  const isGameOver = (state.turn >= MAX_TURNS && state.currentPlayerIndex === 0 && !state.dice) || reachedTarget;

  const ranking = useMemo(() => {
    return [...state.players]
      .map((p, idx) => {
        const s = session.players[idx] ?? session.players[0];
        return {
          id: p.id,
          name: s?.name || p.name,
          avatar: s?.avatar ?? null,
          color: s?.color ?? null,
          laps: p.laps,
          pos: p.position,
        };
      })
      .sort((a, b) => {
        if (b.laps !== a.laps) return b.laps - a.laps;
        return b.pos - a.pos;
      });
  }, [state.players, state.owned, tiles, session.players]);

  const leader = ranking[0] ?? null;
  const liveTop = ranking.slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-7xl p-4 pb-6 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Marx-opoly</h1>
          <p className="mt-1 text-sm text-slate-200/90">
            Fast mode: {MAX_TURNS} lượt • Đua tới {TARGET_LAPS} vòng • Nhóm đi được nhiều vòng nhất chiến thắng.
          </p>
        </div>
        <div className="text-sm text-slate-200 space-y-1 sm:text-right">
          <div>
            Lượt: <span className="font-semibold text-white">{state.turn}</span> / {MAX_TURNS}
          </div>
          <div className="text-xs text-slate-200/90">
            Mục tiêu: <span className="font-semibold text-white">{TARGET_LAPS}</span> vòng
          </div>
          {isGameOver ? (
            <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
              Hết lượt • Đã chốt kết quả
            </div>
          ) : null}
        </div>
      </div>

      {/* Live ranking always visible */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-xl shadow-slate-900/25 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-200" />
            <div className="text-sm font-semibold text-white">Xếp hạng trực tiếp</div>
          </div>
          <div className="text-xs text-slate-200">Vòng → Vị trí</div>
        </div>
        {leader ? (
          <div className="mt-3 rounded-2xl border border-amber-300/25 bg-gradient-to-r from-amber-500/20 to-amber-500/10 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-base font-bold shadow-md"
                    style={{
                      backgroundColor: leader.color ?? undefined,
                      color: leader.color ? "#0f172a" : undefined,
                    }}
                  >
                    {leader.avatar ?? leader.name.slice(0, 1)}
                  </span>
                  <span className="absolute -right-2 -top-2 rounded-full bg-amber-300 p-1 text-slate-900 shadow">
                    <Crown className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-200">Đang dẫn đầu</div>
                  <div className="text-base font-extrabold text-white">{leader.name}</div>
                </div>
              </div>
              <div className="text-right text-xs text-slate-200">
                <div className="text-sm font-semibold text-white">Vòng: {leader.laps}</div>
                <div>Ô: {leader.pos}</div>
              </div>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-amber-300/80 transition-all duration-500"
                style={{ width: `${Math.min(100, (leader.laps / TARGET_LAPS) * 100)}%` }}
              />
            </div>
            <div className="mt-1 text-[11px] text-slate-200">
              Tiến độ: {leader.laps}/{TARGET_LAPS} vòng
            </div>
          </div>
        ) : null}
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {liveTop.map((r, idx) => (
            <div
              key={r.id}
              className={[
                "flex items-center justify-between gap-3 rounded-xl border px-3 py-2",
                idx === 0 ? "border-amber-300/20 bg-white/10" : "border-white/10 bg-white/5",
              ].join(" ")}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-semibold text-slate-200">#{idx + 1}</span>
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-[11px] font-semibold"
                  style={{ backgroundColor: r.color ?? undefined, color: r.color ? "#0f172a" : undefined }}
                >
                  {r.avatar ?? r.name.slice(0, 1)}
                </span>
                <div className="truncate text-sm font-semibold text-white">{r.name}</div>
              </div>
              <div className="text-right text-xs text-slate-200">
                <div className="font-semibold text-white">Vòng: {r.laps}</div>
                <div>Ô: {r.pos}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isGameOver ? (
        <div className="mb-4 overflow-hidden rounded-2xl border border-amber-300/25 bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-sky-500/10 p-4 text-sm text-white shadow-2xl shadow-slate-900/30">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-200" />
              <div className="text-base font-semibold text-white">BẢNG XẾP HẠNG • TRAO QUÀ</div>
            </div>
            <div className="text-xs text-slate-200">Tiêu chí: Số vòng hoàn thành → Vị trí hiện tại</div>
          </div>

          {/* Winner spotlight */}
          {ranking[0] ? (
            <div className="mt-3 rounded-2xl border border-amber-300/30 bg-gradient-to-r from-amber-500/20 to-amber-500/10 p-4 shadow-lg shadow-amber-900/20">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-lg font-bold shadow-md"
                      style={{
                        backgroundColor: ranking[0].color ?? undefined,
                        color: ranking[0].color ? "#0f172a" : undefined,
                      }}
                    >
                      {ranking[0].avatar ?? ranking[0].name.slice(0, 1)}
                    </span>
                    <span className="absolute -right-2 -top-2 rounded-full bg-amber-300 p-1 text-slate-900 shadow">
                      <Crown className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-amber-200">Vô địch</div>
                    <div className="text-xl font-extrabold tracking-tight text-white">{ranking[0].name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-amber-100">Vòng: {ranking[0].laps}</div>
                  <div className="text-xs text-slate-200">Vị trí: ô {ranking[0].pos}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-white/10 p-2 text-center">
                  <div className="text-[11px] text-slate-200">Hạng</div>
                  <div className="text-lg font-extrabold text-white">#1</div>
                </div>
                <div className="rounded-xl bg-white/10 p-2 text-center">
                  <div className="text-[11px] text-slate-200">Vòng</div>
                  <div className="text-lg font-extrabold text-white">{ranking[0].laps}</div>
                </div>
                <div className="rounded-xl bg-white/10 p-2 text-center">
                  <div className="text-[11px] text-slate-200">Ô</div>
                  <div className="text-lg font-extrabold text-white">{ranking[0].pos}</div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Podium list */}
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {ranking.slice(1).map((r, idx) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">#{idx + 2}</span>
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[11px] font-semibold"
                    style={{ backgroundColor: r.color ?? undefined, color: r.color ? "#0f172a" : undefined }}
                  >
                    {r.avatar ?? r.name.slice(0, 1)}
                  </span>
                  <div className="text-sm font-semibold text-white">{r.name}</div>
                </div>
                <div className="text-right text-xs text-slate-200">
                  <div className="font-semibold text-white">Vòng: {r.laps}</div>
                  <div>Ô: {r.pos}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="relative min-h-[70vh] rounded-3xl border border-white/10 bg-white/5 p-3 shadow-xl shadow-slate-900/30 backdrop-blur">
          <div
            className="relative grid rounded-2xl bg-white/70 p-1"
            style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gridTemplateRows: "repeat(5, minmax(0, 1fr))" }}
          >
            {Array.from({ length: 25 }).map((_, i) => {
              const x = i % 5;
              const y = Math.floor(i / 5);
              const t = tileByCoord.get(keyOf({ x, y })) ?? null;
              const isActive = t ? state.players[state.currentPlayerIndex].position === t.index : false;
              const isFocused = t ? focusIndex === t.index : false;

              return (
                <div key={i} className="aspect-square p-1">
                  {t ? (
                    <Tile
                      tile={t}
                      owned={ownedByIndex.get(t.index) ?? null}
                      playersHere={playersAt.get(t.index) ?? []}
                      isActive={isActive}
                      isFocused={isFocused}
                      onHover={() => setFocusIndex(t.index)}
                      onClick={() => setFocusIndex(t.index)}
                    />
                  ) : (
                    <div className="h-full w-full rounded-lg border border-dashed border-white/30 bg-white/40" />
                  )}
                </div>
              );
            })}

            {/* Token overlay for smooth transitions */}
            <div className="pointer-events-none absolute inset-0">
              {tokenCoords.map((t) => {
                const left = `${(t.coord.x + 0.5) * 20}%`;
                const top = `${(t.coord.y + 0.5) * 20}%`;
                const isActive = t.id === state.players[state.currentPlayerIndex].id;
                const stacked = playersAt.get(t.pos) ?? [];
                const idx = stacked.findIndex((p) => p.id === t.id);
                const spread = stacked.length > 1 ? (idx - (stacked.length - 1) / 2) * 16 : 0;
                return (
                  <div
                    key={t.id}
                    className="absolute transition-all duration-500 ease-in-out"
                    style={{ left, top, transform: `translate(-50%, -50%) translateX(${spread}px)` }}
                  >
                    <div
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-full border bg-white text-[12px] font-extrabold shadow-md",
                        isActive ? "border-slate-900 ring-2 ring-slate-900/10" : "border-zinc-200",
                        t.colorClass,
                      ].join(" ")}
                      title={t.name}
                      style={{ backgroundColor: t.colorHex ?? undefined, color: t.colorHex ? "#0f172a" : undefined }}
                    >
                      {t.avatar ?? t.name.slice(0, 1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:sticky lg:top-4">
          <ControlPanel />
          <TileDetail
            tile={tiles[focusIndex] ?? null}
            owned={ownedByIndex.get(focusIndex) ?? null}
            owner={
              ownedByIndex.get(focusIndex)
                ? state.players.find((p) => p.id === ownedByIndex.get(focusIndex)!.ownerId) ?? null
                : null
            }
          />
          <StatsPanel players={state.players} owned={state.owned} tiles={tiles} />
          <LogPanel logs={state.logs} />
        </div>
      </div>

      {flashTile ? (
        <Flashcard tile={flashTile} owned={flashOwned} onClose={closeModal} />
      ) : null}
      {activeQuestion ? <QuestionModal question={activeQuestion} /> : null}
    </div>
  );
}

