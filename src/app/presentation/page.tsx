"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Lightbulb, Presentation, Sparkles } from "lucide-react";
import { SECTIONS } from "./data";

function PollSection({
  choice,
  onChoiceChange,
}: {
  choice: "A" | "B" | null;
  onChoiceChange: (val: "A" | "B") => void;
}) {
  return (
    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
      <div className="mb-2 text-xs font-semibold text-amber-900">Chọn đáp án:</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          onClick={() => onChoiceChange("A")}
          className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
            choice === "A"
              ? "border-red-300 bg-red-50 ring-1 ring-red-200"
              : "border-amber-200 bg-white hover:bg-amber-50"
          }`}
        >
          <div className="text-xs font-semibold text-red-700">A. Nên</div>
          <div className="mt-0.5 text-[10px] text-slate-600">Ưu tiên văn hóa/tinh thần</div>
        </button>
        <button
          onClick={() => onChoiceChange("B")}
          className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
            choice === "B"
              ? "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200"
              : "border-amber-200 bg-white hover:bg-amber-50"
          }`}
        >
          <div className="text-xs font-semibold text-emerald-700">B. Không nên</div>
          <div className="mt-0.5 text-[10px] text-slate-600">Ưu tiên CSHT trước</div>
        </button>
      </div>
      {choice && (
        <div className="mt-2 rounded-lg border border-red-200 bg-white p-2 text-[10px] text-slate-800">
          <div className="mb-1 font-semibold text-red-700">Phân tích:</div>
          <p>
            Khi <span className="font-semibold text-red-700">CSHT còn thấp</span>, đầu tư{" "}
            <span className="font-semibold text-red-700">KTTT vượt quá</span> → mâu thuẫn, không bền vững. Nên ưu tiên
            nâng CSHT trước.
          </p>
        </div>
      )}
    </div>
  );
}

export default function PresentationPage() {
  const router = useRouter();
  const [showNotes, setShowNotes] = useState(false);
  const [pollChoice, setPollChoice] = useState<"A" | "B" | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "n") setShowNotes((v) => !v);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-red-100 bg-gradient-to-b from-red-50/40 to-white px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700 ring-1 ring-red-200">
              <Presentation className="h-3.5 w-3.5" />
              Triết học Mác – Lênin • Chương III
            </div>
            <h1 className="mt-2 text-2xl font-extrabold uppercase leading-tight text-slate-900 md:text-3xl">
              Giải mã nhận định của Karl Marx
            </h1>
            <p className="mt-1 text-sm text-slate-700 md:text-base">
              Con người trước hết phải có ăn, ở, mặc, đi lại, sau đó mới có thể làm chính trị, khoa học, nghệ thuật, tôn giáo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <button
              onClick={() => setShowNotes((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
              title="Bật/tắt ghi chú (phím N)"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Ghi chú
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Fullscreen Grid */}
      <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => router.push(`/presentation/${section.id}`)}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:border-red-300 hover:shadow-md"
            >
              {section.image && (
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={section.image.src}
                    alt={section.image.alt}
                    width={400}
                    height={200}
                    className="h-full w-full object-cover"
                    priority={idx < 4}
                  />
                  <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-[10px] font-bold text-white">
                    {idx + 1}
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col p-3">
                <h2 className="mb-2 text-sm font-bold leading-tight text-slate-900">{section.title}</h2>

                <div className="flex-1 text-xs leading-relaxed text-slate-700">
                  {section.content.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {section.interactive === "poll" && (
                  <PollSection choice={pollChoice} onChoiceChange={setPollChoice} />
                )}

                {showNotes && section.note && (
                  <div className="mt-2 rounded-lg border border-slate-300 bg-slate-50 p-2 text-[10px] text-slate-700">
                    <div className="mb-0.5 flex items-center gap-1 font-semibold text-slate-900">
                      <Lightbulb className="h-3 w-3 text-amber-600" />
                      Ghi chú
                    </div>
                    <p>{section.note}</p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-3 md:px-6">
        <div className="mx-auto max-w-7xl text-center text-xs text-slate-600">
          <div className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-red-500" />
            <span className="font-semibold text-slate-900">Kết thúc</span>
          </div>
          <p className="mt-1">
            Hiểu đúng quan hệ biện chứng CSHT ↔ KTTT để phân tích thực tiễn và ra quyết định hợp quy luật.
          </p>
        </div>
      </footer>
    </div>
  );
}
