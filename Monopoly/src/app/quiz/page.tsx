"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { questions } from "@/lib/questions";
import { useSession } from "@/context/SessionContext";

export default function QuizPage() {
  const { state, addScore } = useSession();
  const active = state.players[state.activePlayerId];

  const bank = useMemo(() => questions, []);
  const [idx, setIdx] = useState(0);
  const q = bank[idx % bank.length];

  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const submit = () => {
    if (picked === null || locked) return;
    const ok = picked === q.answerIndex;
    addScore(active.id, ok ? 1 : 0);
    setLocked(true);
  };

  const next = () => {
    setIdx((i) => i + 1);
    setPicked(null);
    setLocked(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-100">Mode</p>
            <h1 className="text-3xl font-bold">Trắc nghiệm (chấm điểm 4 người)</h1>
            <p className="mt-2 text-sm text-slate-200/90">
              Người đang trả lời: <span className="font-semibold text-white">{active.name}</span> •
              Điểm: <span className="font-semibold text-white">{active.score}</span>
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            ← Về Home
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs text-emerald-100">Câu {idx + 1}</div>
          <h2 className="mt-2 text-xl font-semibold">{q.prompt}</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {q.tags.map((t) => (
              <span key={t} className="rounded-full bg-white/10 px-2 py-1 text-slate-100">
                {t}
              </span>
            ))}
            <span className="rounded-full bg-white/10 px-2 py-1 text-slate-100">Level {q.level}</span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {q.options.map((op, i) => {
              const selected = picked === i;
              const correct = locked && i === q.answerIndex;
              const wrong = locked && selected && i !== q.answerIndex;
              return (
                <button
                  key={i}
                  onClick={() => setPicked(i)}
                  disabled={locked}
                  className={[
                    "rounded-2xl border px-4 py-3 text-left transition",
                    "border-white/10 bg-white/5 hover:bg-white/10 disabled:cursor-not-allowed",
                    selected ? "border-white/30 bg-white/10" : "",
                    correct ? "border-emerald-300/40 bg-emerald-500/10" : "",
                    wrong ? "border-red-300/40 bg-red-500/10" : "",
                  ].join(" ")}
                >
                  <div className="text-xs font-semibold text-slate-200">{String.fromCharCode(65 + i)}</div>
                  <div className="mt-1 text-sm text-slate-50">{op}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-200">
              {locked
                ? picked === q.answerIndex
                  ? "ĐÚNG! +1 điểm"
                  : "SAI! +0 điểm"
                : "Chọn đáp án rồi bấm Xác nhận."}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={submit}
                disabled={picked === null || locked}
                className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Xác nhận
              </button>
              <button
                onClick={next}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Câu tiếp →
              </button>
            </div>
          </div>

          {locked ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100/90">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-100">Giải thích</div>
              <div className="mt-2">{q.explain}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

