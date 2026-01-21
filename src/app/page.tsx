import Link from "next/link";
import { BookOpen, Gamepad2, HelpCircle, Swords } from "lucide-react";
import { PlayerSetup } from "@/components/PlayerSetup";

const modes = [
  {
    title: "Lý thuyết",
    desc: "Ôn nhanh cơ sở hạ tầng, kiến trúc thượng tầng, hình thái KT-XH.",
    icon: <BookOpen className="h-6 w-6" />,
    href: "/theory",
    tone: "from-blue-500 to-sky-400",
  },
  {
    title: "Trắc nghiệm",
    desc: "Câu hỏi nhanh cho 4 người – chấm điểm theo từng người.",
    icon: <HelpCircle className="h-6 w-6" />,
    href: "/quiz",
    tone: "from-emerald-500 to-teal-400",
  },
  {
    title: "Game tình huống",
    desc: "Bốc tình huống, trình bày theo timer, gợi ý CSHT/KT-TT.",
    icon: <Swords className="h-6 w-6" />,
    href: "/scenario",
    tone: "from-orange-500 to-amber-400",
  },
  {
    title: "Board game Marx-opoly",
    desc: "Chơi bảng 5x5, mua/thuê tài sản, thẻ hạ tầng/thượng tầng.",
    icon: <Gamepad2 className="h-6 w-6" />,
    href: "/game",
    tone: "from-indigo-500 to-purple-500",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 md:py-16">
        <header className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-white/10">
            Nhóm 4 • Triết học Mác – Lênin • Hình thái KT-XH
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">Chọn chế độ học & chơi</h1>
          <p className="text-base text-slate-200 md:text-lg">
            Hub cho thuyết trình: ôn lý thuyết, làm trắc nghiệm chấm điểm 4 người, chơi game tình
            huống có timer, và trải nghiệm board game.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {modes.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
            >
              <div
                className={`absolute inset-0 opacity-0 blur-3xl transition group-hover:opacity-20 bg-gradient-to-br ${m.tone}`}
              />
              <div className="relative flex items-start gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${m.tone} text-white shadow-lg`}
                >
                  {m.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{m.title}</h3>
                  <p className="text-sm text-slate-200/90">{m.desc}</p>
                  <div className="text-xs font-semibold text-blue-100">Vào ngay →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <PlayerSetup />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200 md:text-base">
          <h2 className="text-lg font-semibold text-white">Gợi ý chia vai thuyết trình</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-200/90">
            <li>Người 1: Tóm tắt lý thuyết hình thái KT-XH.</li>
            <li>Người 2: Giới thiệu giao diện & trải nghiệm (hub + mode).</li>
            <li>Người 3: Trắc nghiệm – cách chấm điểm, cách dẫn dắt hỏi đáp.</li>
            <li>Người 4: Game tình huống – liên hệ thực tiễn, kết luận.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
