"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Crown, Star, Sparkles, RotateCcw, Home } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useSession } from "@/context/SessionContext";
import { TARGET_LAPS } from "@/lib/gameData";
import Link from "next/link";

type RankedPlayer = {
  id: string;
  name: string;
  avatar: string | null;
  color: string | null;
  laps: number;
  pos: number;
  correct: number;
  wrong: number;
};

export function WinnerModal({ ranking }: { ranking: RankedPlayer[] }) {
  const { reset } = useGame();
  const [showConfetti, setShowConfetti] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setAnimateIn(true), 100);
    // Stop confetti after a while
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const winner = ranking[0];
  const confettiEmojis = ["🎉", "⭐", "✨", "🌟", "💫", "🎊", "🏆", "👑", "🥇", "🎯"];
  const rankEmojis = ["🥇", "🥈", "🥉"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      {/* Confetti */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                animation: `confettiFall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
              }}
            >
              {confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)]}
            </div>
          ))}
        </div>
      )}

      {/* Radial glow behind winner */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${winner?.color || "#fbbf24"}40 0%, transparent 50%)`,
        }}
      />

      <div
        className={[
          "relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl transition-all duration-700",
          "bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900",
          "border border-amber-400/30",
          animateIn ? "scale-100 opacity-100" : "scale-90 opacity-0",
        ].join(" ")}
      >
        {/* Decorative top bar */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />

        {/* Header */}
        <div className="relative p-6 pb-0 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.2),transparent_60%)]" />

          <div className="relative">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-xl shadow-amber-500/50">
              <Trophy className="h-10 w-10 text-slate-900" />
            </div>

            <h2 className="text-3xl font-black uppercase tracking-wide text-white">
              Kết thúc trò chơi!
            </h2>
            <p className="mt-2 text-amber-300">
              {winner?.laps >= TARGET_LAPS
                ? `${winner.name} đã hoàn thành ${TARGET_LAPS} vòng đầu tiên!`
                : "Đã hết lượt chơi - Tổng kết thành tích"}
            </p>
          </div>
        </div>

        {/* Winner Showcase */}
        {winner && (
          <div className="relative mx-6 mt-6 overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 p-6">
            {/* Sparkle effects */}
            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Sparkles
                  key={i}
                  className="absolute h-4 w-4 text-amber-400 sparkle"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 2) * 60}%`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative flex items-center gap-6">
              {/* Winner Avatar */}
              <div className="relative">
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-400 text-4xl font-black shadow-2xl active-player-glow"
                  style={{
                    backgroundColor: winner.color ?? "#fbbf24",
                    color: "#1e293b",
                  }}
                >
                  {winner.avatar ?? winner.name.slice(0, 1)}
                </div>
                <div className="absolute -right-2 -top-2 rounded-full bg-amber-400 p-2 shadow-lg">
                  <Crown className="h-5 w-5 text-slate-900" />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1 text-xs font-black text-slate-900 shadow-lg">
                  WINNER
                </div>
              </div>

              {/* Winner Info */}
              <div className="flex-1">
                <div className="text-sm font-semibold uppercase tracking-wide text-amber-400">
                  🏆 Quán quân
                </div>
                <div className="mt-1 text-3xl font-black text-white">{winner.name}</div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <div className="rounded-lg bg-white/10 px-3 py-1.5">
                    <div className="text-2xl font-black text-amber-300">{winner.laps}</div>
                    <div className="text-[10px] text-slate-400">vòng</div>
                  </div>
                  <div className="rounded-lg bg-white/10 px-3 py-1.5">
                    <div className="text-2xl font-black text-emerald-400">{winner.correct}</div>
                    <div className="text-[10px] text-slate-400">đúng</div>
                  </div>
                  <div className="rounded-lg bg-white/10 px-3 py-1.5">
                    <div className="text-2xl font-black text-red-400">{winner.wrong}</div>
                    <div className="text-[10px] text-slate-400">sai</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Rankings */}
        <div className="p-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-400">
            <Star className="h-4 w-4" />
            Bảng xếp hạng đầy đủ
          </div>

          <div className="space-y-2">
            {ranking.map((player, idx) => (
              <div
                key={player.id}
                className={[
                  "flex items-center justify-between rounded-xl p-3 transition-all",
                  idx === 0
                    ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 ring-1 ring-amber-400/30"
                    : idx === 1
                      ? "bg-gradient-to-r from-slate-400/10 to-slate-500/10 ring-1 ring-slate-400/20"
                      : idx === 2
                        ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10 ring-1 ring-orange-400/20"
                        : "bg-white/5",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center text-xl">
                    {rankEmojis[idx] || `#${idx + 1}`}
                  </span>
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: player.color ?? "#64748b",
                      color: "#1e293b",
                    }}
                  >
                    {player.avatar ?? player.name.slice(0, 1)}
                  </span>
                  <span className="font-semibold text-white">{player.name}</span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400">
                    <span className="font-bold text-emerald-400">{player.correct}</span> ✓
                  </span>
                  <span className="text-slate-400">
                    <span className="font-bold text-red-400">{player.wrong}</span> ✗
                  </span>
                  <span className="min-w-[60px] rounded-lg bg-white/10 px-2 py-1 text-center font-bold text-amber-300">
                    {player.laps} vòng
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-white/10 bg-white/5 p-4">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 font-semibold text-white transition-all hover:bg-white/20"
          >
            <Home className="h-5 w-5" />
            Về trang chủ
          </Link>
          <button
            onClick={reset}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-3 font-bold text-slate-900 shadow-lg shadow-amber-500/30 transition-all hover:from-amber-600 hover:to-yellow-600 hover:shadow-xl"
          >
            <RotateCcw className="h-5 w-5" />
            Chơi lại
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
