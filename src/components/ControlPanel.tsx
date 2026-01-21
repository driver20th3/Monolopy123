"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dices, LogOut, RotateCcw } from "lucide-react";
import { CRISIS_BAIL, MAX_TURNS, TARGET_LAPS } from "@/lib/gameData";
import { useGame } from "@/context/GameContext";
import { useSession } from "@/context/SessionContext";

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
  const { state, tiles, rollDice, openQuestion, endTurn, payBail, clearMessage, reset } = useGame();
  const { state: session } = useSession();
  const current = state.players[state.currentPlayerIndex];
  const tile = tiles[current.position];
  const sessionPlayer = session.players[state.currentPlayerIndex] ?? session.players[0];
  const displayName = current.isHuman ? sessionPlayer.name || current.name : current.name;

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

  const reachedTarget = state.players.some((p) => p.laps >= TARGET_LAPS);
  const isOver = (state.turn >= MAX_TURNS && state.currentPlayerIndex === 0) || reachedTarget;
  const hasActed = state.hasActedThisTurn && current.isHuman;
  const isQuestionOpen = state.activeModal.kind === "question";

  const onRollClick = () => {
    if (isRolling) return;

    // Must answer question first. One-click flow: open question modal.
    if (!state.diceAllowance) {
      openQuestion();
      return;
    }

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current.isHuman) return;
      if (isQuestionOpen) return;
      const key = e.key.toLowerCase();
      if (key === "r") {
        onRollClick();
      }
      if (key === "e") {
        endTurn();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current.isHuman, endTurn, isQuestionOpen, onRollClick]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/90 p-4 shadow-lg shadow-slate-900/20 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-slate-500">Lượt hiện tại</div>
          <div className="flex items-center gap-2">
            {current.isHuman ? (
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-[11px] font-semibold"
                style={{ backgroundColor: sessionPlayer.color, color: "#0f172a" }}
                title="Avatar nhóm (đồng bộ Session)"
              >
                {sessionPlayer.avatar || displayName.slice(0, 1)}
              </span>
            ) : null}
            <div className="truncate text-lg font-semibold text-slate-900">{displayName}</div>
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Đang ở: <span className="font-medium text-slate-900">{tile.name}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
            <span className="rounded-full bg-slate-100 px-2 py-1">Phím tắt: R gieo, E kết thúc</span>
            {state.awaitingDecision ? (
              <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">Đang chờ quyết định mua</span>
            ) : null}
          </div>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Chơi lại
        </button>
      </div>

      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-700">
            {state.dice ? (
              <>
                Xúc xắc: <span className="font-semibold">{state.dice.a}</span> +{" "}
                <span className="font-semibold">{state.dice.b}</span> ={" "}
                <span className="font-semibold">{state.dice.total}</span>
              </>
            ) : (
              <span className="text-slate-600">
                {state.diceAllowance
                  ? `Bạn được gieo ${state.diceAllowance} xúc xắc. Nhấn Gieo để di chuyển.`
                  : "Trả lời câu hỏi trước khi được gieo xúc xắc."}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DiceFace value={shownA} rolling={isRolling} />
            <DiceFace value={shownB} rolling={isRolling} />
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-50 p-2 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span>1. Trả lời câu hỏi</span>
            <span
              className={[
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                state.diceAllowance ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700",
              ].join(" ")}
            >
              {state.diceAllowance ? "Đã xong" : "Chưa"}
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-2 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span>2. Gieo để chạy vòng</span>
            <span
              className={[
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                state.dice ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700",
              ].join(" ")}
            >
              {state.dice ? "Đã gieo" : "Chờ gieo"}
            </span>
          </div>
        </div>
      </div>

      {state.message ? (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">{state.message}</div>
            <button onClick={clearMessage} className="text-xs font-semibold hover:underline">
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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Dices className="h-4 w-4" />
          {isRolling ? "Đang gieo..." : "Gieo"}
        </button>

        <button
          onClick={endTurn}
          disabled={!current.isHuman || isOver}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          Kết thúc lượt
        </button>
      </div>

      {current.isHuman && current.skipTurns > 0 ? (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          <div className="flex items-center justify-between gap-3">
            <div>
              Bạn đang bị kẹt (bỏ lượt: <span className="font-semibold">{current.skipTurns}</span>).
            </div>
            <button
              onClick={payBail}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Trả bảo lãnh ({CRISIS_BAIL})
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

