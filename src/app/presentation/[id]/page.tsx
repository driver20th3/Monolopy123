"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Home, Lightbulb, Presentation } from "lucide-react";
import { SECTIONS, type Section } from "../data";

function PollSection({
  choice,
  onChoiceChange,
}: {
  choice: "A" | "B" | null;
  onChoiceChange: (val: "A" | "B") => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
      <div className="mb-3 text-sm font-semibold text-amber-900">Chọn đáp án rồi xem phân tích:</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => onChoiceChange("A")}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            choice === "A"
              ? "border-red-300 bg-red-50 ring-2 ring-red-200"
              : "border-amber-200 bg-white hover:bg-amber-50"
          }`}
        >
          <div className="text-sm font-semibold text-red-700">A. Nên</div>
          <div className="mt-1 text-xs text-slate-600">Ưu tiên biểu tượng văn hóa/đời sống tinh thần.</div>
        </button>
        <button
          onClick={() => onChoiceChange("B")}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            choice === "B"
              ? "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-200"
              : "border-amber-200 bg-white hover:bg-amber-50"
          }`}
        >
          <div className="text-sm font-semibold text-emerald-700">B. Không nên</div>
          <div className="mt-1 text-xs text-slate-600">Ưu tiên nâng CSHT (sản xuất, an sinh, hạ tầng vật chất).</div>
        </button>
      </div>
      {choice && (
        <div className="mt-4 rounded-xl border border-red-200 bg-white p-4 text-sm text-slate-800">
          <div className="mb-2 font-semibold text-red-700">Phân tích theo CSHT ↔ KTTT:</div>
          <p>
            Khi <span className="font-semibold text-red-700">CSHT còn thấp</span>, nếu đầu tư vào{" "}
            <span className="font-semibold text-red-700">KTTT vượt quá</span> sẽ dễ tạo mâu thuẫn, thiếu nguồn lực vận
            hành và không bền vững. Nên ưu tiên nâng CSHT (kinh tế, hạ tầng, an sinh), sau đó mở rộng đầu tư KTTT tương
            ứng.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showNotes, setShowNotes] = useState(false);
  const [pollChoice, setPollChoice] = useState<"A" | "B" | null>(null);

  const sectionId = params?.id as string;
  const section = SECTIONS.find((s) => s.id === sectionId);
  const sectionIndex = section ? SECTIONS.findIndex((s) => s.id === sectionId) : -1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "n") setShowNotes((v) => !v);
      if (e.key === "Escape") router.push("/presentation");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  if (!section) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Không tìm thấy section</h1>
          <Link href="/presentation" className="mt-4 inline-block text-red-600 hover:underline">
            ← Về trang chính
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/presentation"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Về grid
            </Link>
            <div className="text-sm text-slate-700">
              Phần <span className="font-semibold text-slate-900">{sectionIndex + 1}</span>/{SECTIONS.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <button
              onClick={() => setShowNotes((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50"
              title="Bật/tắt ghi chú (phím N)"
            >
              <Lightbulb className="h-4 w-4" />
              Ghi chú
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {section.image && (
            <div className="overflow-hidden rounded-t-2xl border-b border-slate-200 bg-slate-100">
              <Image
                src={section.image.src}
                alt={section.image.alt}
                width={1200}
                height={600}
                className="h-64 w-full object-cover md:h-80"
                priority
              />
            </div>
          )}

          <div className="px-6 py-6 md:px-8 md:py-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-base font-bold text-red-700">
                {sectionIndex + 1}
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700 ring-1 ring-red-200">
                  <Presentation className="h-3.5 w-3.5" />
                  Triết học Mác – Lênin • Chương III
                </div>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">{section.title}</h1>
              </div>
            </div>

            <div className="space-y-4 text-slate-700">
              {section.content.map((para, i) => (
                <p key={i} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {section.interactive === "poll" && (
              <PollSection choice={pollChoice} onChoiceChange={setPollChoice} />
            )}

            {showNotes && section.note && (
              <div className="mt-6 rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="mb-1 flex items-center gap-2 font-semibold text-slate-900">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  Ghi chú thuyết trình
                </div>
                <p>{section.note}</p>
              </div>
            )}
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {sectionIndex > 0 ? (
            <Link
              href={`/presentation/${SECTIONS[sectionIndex - 1].id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Phần trước
            </Link>
          ) : (
            <div />
          )}
          {sectionIndex < SECTIONS.length - 1 ? (
            <Link
              href={`/presentation/${SECTIONS[sectionIndex + 1].id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Phần sau
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
}

