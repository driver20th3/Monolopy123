"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";

type Scenario = {
  title: string;
  prompt: string;
  hints: string[];
};

const scenarios: Scenario[] = [
  {
    title: "Kinh tế số & pháp luật",
    prompt:
      "Nền tảng số (giao đồ ăn/xe công nghệ) phát triển nhanh. CSHT thay đổi gì? KTTT cần điều chỉnh gì để phù hợp?",
    hints: [
      "CSHT: công nghệ nền tảng, dữ liệu, mô hình lao động linh hoạt.",
      "KTTT: luật lao động nền tảng, thuế, bảo vệ dữ liệu cá nhân, cạnh tranh.",
      "Mâu thuẫn: quyền lợi lao động vs mô hình kinh doanh; pháp luật chậm cập nhật.",
    ],
  },
  {
    title: "AI & tự động hóa",
    prompt: "AI làm tăng năng suất (LLSX). QHSX và KTTT cần thay đổi gì để tránh mâu thuẫn xã hội?",
    hints: [
      "CSHT: tự động hóa, lao động tri thức tăng, lao động giản đơn giảm.",
      "KTTT: đào tạo lại, an sinh, chính sách việc làm, đạo đức/luật về AI.",
    ],
  },
  {
    title: "Chuyển dịch năng lượng",
    prompt: "Đầu tư năng lượng tái tạo tăng mạnh. KTTT tác động trở lại CSHT thế nào?",
    hints: [
      "CSHT: công nghệ pin, gió/mặt trời, lưới điện thông minh.",
      "KTTT: quy hoạch, giá điện, ưu đãi, môi trường, chuẩn kỹ thuật.",
    ],
  },
];

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ScenarioPage() {
  const { state } = useSession();
  const active = state.players[state.activePlayerId];

  const pool = useMemo(() => scenarios, []);
  const [current, setCurrent] = useState<Scenario>(() => pool[0]);
  const [reveal, setReveal] = useState(false);

  const [seconds, setSeconds] = useState(90);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [running, seconds]);

  const draw = () => {
    const next = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(next);
    setReveal(false);
    setSeconds(90);
    setRunning(false);
  };

  const toggle = () => setRunning((v) => !v);
  const resetTimer = () => {
    setSeconds(90);
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-amber-100">Mode</p>
            <h1 className="text-3xl font-bold">Game tình huống (timer thuyết trình)</h1>
            <p className="mt-2 text-sm text-slate-200/90">
              Người trình bày: <span className="font-semibold text-white">{active.name}</span>
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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs text-amber-100">Tình huống</div>
              <h2 className="mt-2 text-2xl font-semibold">{current.title}</h2>
              <p className="mt-2 text-sm text-slate-100/90">{current.prompt}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="text-xs uppercase tracking-wide text-amber-100">Timer</div>
              <div className="mt-2 text-4xl font-bold tabular-nums">{formatTime(seconds)}</div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={toggle}
                  className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950"
                >
                  {running ? "Tạm dừng" : "Bắt đầu"}
                </button>
                <button
                  onClick={resetTimer}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Reset
                </button>
              </div>
              {seconds <= 0 ? (
                <div className="mt-3 rounded-xl border border-red-200/20 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                  Hết giờ! Chuyển lượt hoặc chốt kết luận.
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={draw}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Bốc tình huống khác
            </button>
            <button
              onClick={() => setReveal((v) => !v)}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {reveal ? "Ẩn gợi ý" : "Hiện gợi ý CSHT/KTTT"}
            </button>
          </div>

          {reveal ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100/90">
              <div className="text-xs font-semibold uppercase tracking-wide text-amber-100">Gợi ý</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {current.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

