export type QuestionTag = "CSHT" | "KTTT" | "BIEN_CHUNG" | "THUC_TIEN";

export type Question = {
  id: string;
  level: 1 | 2 | 3; // 1 basic, 2 apply, 3 practical
  tags: QuestionTag[];
  prompt: string;
  options: string[];
  answerIndex: number;
  explain: string;
};

export const questions: Question[] = [
  {
    id: "q-csht-1",
    level: 1,
    tags: ["CSHT"],
    prompt: "Cơ sở hạ tầng (CSHT) theo Marx gồm hai thành phần chính nào?",
    options: [
      "Nhà nước và pháp luật",
      "Lực lượng sản xuất và quan hệ sản xuất",
      "Tư tưởng và văn hóa",
      "Giáo dục và truyền thông",
    ],
    answerIndex: 1,
    explain: "CSHT = lực lượng sản xuất + quan hệ sản xuất (nền tảng kinh tế của xã hội).",
  },
  {
    id: "q-kttt-1",
    level: 1,
    tags: ["KTTT"],
    prompt: "Kiến trúc thượng tầng (KTTT) bao gồm nhóm yếu tố nào sau đây?",
    options: [
      "Quan hệ sản xuất và phân phối",
      "Công nghệ và năng suất lao động",
      "Nhà nước, pháp luật, tư tưởng, văn hóa",
      "Tài nguyên và địa lý",
    ],
    answerIndex: 2,
    explain: "KTTT gồm thiết chế chính trị–pháp luật và các hình thái ý thức xã hội (tư tưởng, văn hóa...).",
  },
  {
    id: "q-bienchung-1",
    level: 1,
    tags: ["BIEN_CHUNG"],
    prompt: "Vì sao nói CSHT quyết định KTTT?",
    options: [
      "Vì KTTT luôn đi trước CSHT",
      "Vì KTTT là tổng hòa quan hệ sản xuất",
      "Vì CSHT là nền tảng vật chất–kinh tế làm nảy sinh và quy định KTTT tương ứng",
      "Vì pháp luật quyết định sản xuất",
    ],
    answerIndex: 2,
    explain: "Cấu trúc kinh tế (CSHT) tạo ra nhu cầu/điều kiện cho nhà nước, pháp luật, tư tưởng tương ứng (KTTT).",
  },
  {
    id: "q-bienchung-2",
    level: 2,
    tags: ["BIEN_CHUNG"],
    prompt: "“KTTT tác động trở lại CSHT” nghĩa là gì?",
    options: [
      "KTTT hoàn toàn tách khỏi CSHT",
      "KTTT luôn quyết định CSHT",
      "KTTT có thể thúc đẩy hoặc kìm hãm sự phát triển kinh tế thông qua chính sách, luật pháp, tư tưởng",
      "CSHT không bao giờ thay đổi",
    ],
    answerIndex: 2,
    explain: "KTTT có tính độc lập tương đối, tác động lại CSHT theo hướng tích cực/tiêu cực (thúc đẩy/kìm hãm).",
  },
  {
    id: "q-thuctien-1",
    level: 3,
    tags: ["THUC_TIEN", "BIEN_CHUNG"],
    prompt: "Ví dụ nào thể hiện mâu thuẫn CSHT ↔ KTTT trong kinh tế số hiện nay?",
    options: [
      "Công nghệ nền tảng phát triển nhanh nhưng luật lao động nền tảng chậm cập nhật",
      "Nông nghiệp truyền thống ổn định lâu dài",
      "Giá cả thị trường biến động theo mùa",
      "Thời tiết thay đổi theo vùng",
    ],
    answerIndex: 0,
    explain: "CSHT (công nghệ/nền tảng) phát triển vượt khung KTTT (pháp luật) → nảy sinh mâu thuẫn xã hội.",
  },
];

