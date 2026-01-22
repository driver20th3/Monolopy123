"use client";

import Link from "next/link";
import { UsersRound, Sparkles } from "lucide-react";
import { PlayerSetup } from "@/components/PlayerSetup";

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-100 ring-1 ring-white/15">
              <UsersRound className="h-3.5 w-3.5" />
              Nhóm & avatar
            </div>
            <h1 className="text-3xl font-bold">Đăng ký nhóm • chọn màu • đặt avatar</h1>
            <p className="text-sm text-slate-200/90">
              Thiết lập nhóm một lần, lưu tại chỗ để đồng bộ sang Trắc nghiệm, Tình huống và Board game. Chọn màu
              nhận diện, đặt tên và avatar để dễ đổi lượt.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-100">
              <span className="rounded-full bg-white/10 px-2 py-1">Lưu cục bộ (localStorage)</span>
              <span className="rounded-full bg-white/10 px-2 py-1">Hiển thị trên thanh trên cùng</span>
              <span className="rounded-full bg-white/10 px-2 py-1">Áp dụng cho 4 chế độ</span>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            ← Về Home
          </Link>
        </div>

        <PlayerSetup />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-100/90">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white/10 p-2 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-white">Gợi ý dùng tab Đăng ký nhóm</h2>
              <ul className="space-y-1 list-disc pl-5">
                <li>Đặt màu khác nhau cho từng nhóm để dễ nhìn khi chuyển lượt.</li>
                <li>Avatar emoji hiển thị ở top bar và trong các mode chấm điểm.</li>
                <li>Reset điểm dùng cho buổi mới; Reset tất cả để về mặc định.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

