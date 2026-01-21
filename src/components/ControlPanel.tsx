"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dices, HandCoins, Hammer, LogOut, RotateCcw } from "lucide-react";
import { CRISIS_BAIL, MAX_TURNS } from "@/lib/gameData";
import { useGame } from "@/context/GameContext";
import { isProperty } from "@/lib/rules";

function DiceFace({ value, rolling }: { value: number; rolling: boolean }) {
  const on = (r: number, c: number) => {
    const map: Record<number, Array<[number, number]>> = {
      1: [[2, 2]],
      2: [
        [1, 1],
        [3, 3],
      ],
      3: [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      4: [
        [1, 1],
        [1, 3],
        [3, 1],
        [3, 3],
      ],
      5: [
        [1, 1],
        [1, 3],
        [2, 2],
        [3, 1],
        [3, 3],
      ],
      6: [
        [1, 1],
        [2, 1],
        [3, 1],
        [1, 3],
        [2, 3],
        [3, 3],
      ],
    };
    return (map[value] ?? []).some(([rr, cc]) => rr === r && cc === c);
  };

  return (
    <div
      className={[
        "h-10 w-10 rounded-xl border border-zinc-200 bg-white shadow-sm p-1",
        rolling ? "dice-roll" : "",
      ].join(" ")}
    >
      <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => {
          const r = Math.floor(i / 3) + 1;
          const c = (i % 3) + 1;
          return (
            <div key={i} className="flex items-center justify-center">
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full bg-zinc-900 transition-opacity",
                  on(r, c) ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ControlPanel() {
  const { state, tiles, rollDice, endTurn, buy, build, payBail, clearMessage, reset } = useGame();
  const current = state.players[state.currentPlayerIndex];
  const tile = tiles[current.position];

  const [isRolling, setIsRolling] = useState(false);
  const [preview, setPreview] = useState<{ a: number; b: number } | null>(null);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const owned = useMemo(
    () => state.owned.find((o) => o.tileIndex === current.position) ?? null,
    [state.owned, current.position]
  );

  const canBuy =
    current.isHuman &&
    state.awaitingDecision?.kind === "buyProperty" &&
    state.awaitingDecision.tileIndex === current.position;

  const canBuild =
    current.isHuman &&
    isProperty(tile) &&
    owned?.ownerId === current.id &&
    owned.upgrades < tile.maxUpgrades;

  const isOver = state.turn >= MAX_TURNS && state.currentPlayerIndex === 0;
  const hasActed = state.hasActedThisTurn && current.isHuman;

  const onRollClick = () => {
    if (isRolling) return;

    setIsRolling(true);
    setPreview({ a: 1 + Math.floor(Math.random() * 6), b: 1 + Math.floor(Math.random() * 6) });

    intervalRef.current = window.setInterval(() => {
      setPreview({ a: 1 + Math.floor(Math.random() * 6), b: 1 + Math.floor(Math.random() * 6) });
    }, 90);

    timerRef.current = window.setTimeout(() => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      rollDice();
      setIsRolling(false);
      setPreview(null);
    }, 800);
  };

  const shownA = isRolling ? preview?.a ?? 1 : state.dice?.a ?? 1;
  const shownB = isRolling ? preview?.b ?? 1 : state.dice?.b ?? 1;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-zinc-500">Lượt hiện tại</div>
          <div className="truncate text-lg font-semibold text-zinc-900">{current.name}</div>
          <div className="mt-1 text-sm text-zinc-600">
            Đang ở: <span className="font-medium text-zinc-900">{tile.name}</span>
          </div>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          <RotateCcw className="h-4 w-4" />
          Chơi lại
        </button>
      </div>

      <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-zinc-700">
            {state.dice ? (
              <>
                Xúc xắc: <span className="font-semibold">{state.dice.a}</span> +{" "}
                <span className="font-semibold">{state.dice.b}</span> ={" "}
                <span className="font-semibold">{state.dice.total}</span>
              </>
            ) : (
              <span className="text-zinc-600">Hãy gieo xúc xắc để di chuyển.</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DiceFace value={shownA} rolling={isRolling} />
            <DiceFace value={shownB} rolling={isRolling} />
          </div>
        </div>
      </div>

      {state.message ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">{state.message}</div>
            <button onClick={clearMessage} className="text-xs font-semibold text-red-800 hover:underline">
              Đóng
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={onRollClick}
          disabled={
            !current.isHuman ||
            current.skipTurns > 0 ||
            Boolean(state.awaitingDecision) ||
            isOver ||
            isRolling ||
            hasActed
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          <Dices className="h-4 w-4" />
          {isRolling ? "Đang gieo..." : "Gieo"}
        </button>

        <button
          onClick={endTurn}
          disabled={!current.isHuman || isOver}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          Kết thúc lượt
        </button>

        <button
          onClick={buy}
          disabled={!canBuy || isOver}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <HandCoins className="h-4 w-4" />
          Mua
        </button>

        <button
          onClick={() => build(current.position)}
          disabled={!canBuild || isOver}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Hammer className="h-4 w-4" />
          Xây
        </button>
      </div>

      {current.isHuman && current.skipTurns > 0 ? (
        <div className="mt-4 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700">
          <div className="flex items-center justify-between gap-3">
            <div>
              Bạn đang bị kẹt (bỏ lượt: <span className="font-semibold">{current.skipTurns}</span>).
            </div>
            <button
              onClick={payBail}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Trả bảo lãnh ({CRISIS_BAIL})
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

