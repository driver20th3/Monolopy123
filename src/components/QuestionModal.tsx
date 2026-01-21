"use client";

import React, { useMemo, useState } from "react";
import type { Question } from "@/lib/questions";
import { useGame } from "@/context/GameContext";

export function QuestionModal(props: { question: Question }) {
  const { question } = props;
  const { answerQuestion, closeModal } = useGame();
  const [picked, setPicked] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);

  const isCorrect = useMemo(() => (picked === null ? null : picked === question.answerIndex), [picked, question.answerIndex]);

  const submit = () => {
    if (picked === null) return;
    answerQuestion(picked === question.answerIndex);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-blue-100">
              <span className="rounded-full bg-white/10 px-2 py-1">Bắt buộc trước khi gieo</span>
              <span className="rounded-full bg-white/10 px-2 py-1">Đúng: 2 xúc xắc</span>
              <span className="rounded-full bg-white/10 px-2 py-1">Sai: 1 xúc xắc</span>
            </div>
            <h3 className="mt-2 text-xl font-semibold leading-snug">{question.prompt}</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {question.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-2 py-1 text-slate-100">
                  {t}
                </span>
              ))}
              <span className="rounded-full bg-white/10 px-2 py-1 text-slate-100">Level {question.level}</span>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="shrink-0 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Đóng
          </button>
        </div>

        <div className="p-5">
          <div className="grid gap-3 md:grid-cols-2">
            {question.options.map((op, idx) => {
              const selected = picked === idx;
              const correct = reveal && idx === question.answerIndex;
              const wrong = reveal && selected && idx !== question.answerIndex;

              return (
                <button
                  key={idx}
                  onClick={() => setPicked(idx)}
                  className={[
                    "rounded-2xl border px-4 py-3 text-left transition",
                    "border-white/10 bg-white/5 hover:bg-white/10",
                    selected ? "border-white/30 bg-white/10" : "",
                    correct ? "border-emerald-300/40 bg-emerald-500/10" : "",
                    wrong ? "border-red-300/40 bg-red-500/10" : "",
                  ].join(" ")}
                >
                  <div className="text-xs font-semibold text-slate-200">{String.fromCharCode(65 + idx)}</div>
                  <div className="mt-1 text-sm text-slate-50">{op}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-200">
              {picked === null ? "Chọn 1 đáp án để tiếp tục." : reveal ? (isCorrect ? "ĐÚNG!" : "SAI rồi!") : "Đã chọn."}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReveal((v) => !v)}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                {reveal ? "Ẩn giải thích" : "Hiện giải thích"}
              </button>
              <button
                onClick={submit}
                disabled={picked === null}
                className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Xác nhận
              </button>
            </div>
          </div>

          {reveal ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100/90">
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-100">Giải thích</div>
              <div className="mt-2">{question.explain}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

