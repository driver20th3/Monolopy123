import Link from "next/link";

export default function TheoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-100">Mode</p>
            <h1 className="text-3xl font-bold">Lý thuyết hình thái KT–XH</h1>
            <p className="mt-2 text-sm text-slate-200/90">
              Bản tóm tắt để thuyết trình: CSHT quyết định KTTT, KTTT tác động trở lại, mâu thuẫn và
              cải cách/đổi mới.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            ← Về Home
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold">1) Cơ sở hạ tầng (CSHT)</h2>
            <ul className="mt-2 space-y-2 text-sm text-slate-100/90">
              <li>- CSHT là nền tảng kinh tế: LLSX + QHSX.</li>
              <li>- CSHT quyết định KTTT tương ứng.</li>
              <li>- CSHT biến đổi → KTTT biến đổi theo.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-lg font-semibold">2) Kiến trúc thượng tầng (KTTT)</h2>
            <ul className="mt-2 space-y-2 text-sm text-slate-100/90">
              <li>- Nhà nước, pháp luật, chính trị, tư tưởng, văn hóa...</li>
              <li>- Có tính độc lập tương đối.</li>
              <li>- Tác động trở lại CSHT: thúc đẩy hoặc kìm hãm.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-semibold">3) Mâu thuẫn & chuyển biến</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-100/90">
            <li>- Mâu thuẫn giữa LLSX và QHSX là động lực phát triển.</li>
            <li>- CSHT phát triển vượt khung KTTT → nảy sinh mâu thuẫn xã hội.</li>
            <li>- Khi cần thiết: cải cách/đổi mới để tái phù hợp.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-semibold">4) Trích dẫn Marx (để “đóng khung” game)</h2>
          <p className="mt-2 text-sm text-slate-100/90">
            “Con người trước hết phải ăn, uống, ở, mặc… rồi sau đó mới có thể làm chính trị, khoa
            học, nghệ thuật…”
          </p>
          <p className="mt-2 text-sm text-slate-200/90">
            Trong Marx-opoly, điều này được gamify thành “Eat First Rule” và “trả lời câu hỏi trước
            khi đổ xúc xắc”.
          </p>
        </div>
      </div>
    </div>
  );
}

