export type Section = {
  id: string;
  title: string;
  content: string[];
  note?: string;
  interactive?: "poll";
  image?: { src: string; alt: string };
};

export const SECTIONS: Section[] = [
  {
    id: "s2",
    title: "Cơ sở hạ tầng (CSHT)",
    content: [
      "Cơ sở hạ tầng là toàn bộ quan hệ sản xuất hợp thành cơ cấu kinh tế của xã hội. Không phải cầu đường, nhà cửa; mà là quan hệ sở hữu – quản lý – phân phối trong sản xuất. Nhu cầu ăn, ở, mặc, đi lại thuộc sản xuất vật chất, nằm trong CSHT.",
    ],
    note: "Nhấn mạnh: đừng nhầm ‘hạ tầng’ trong đời sống thường ngày với ‘hạ tầng’ trong triết học Mác.",
    image: {
      src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      alt: "Công nhân và máy móc tượng trưng sản xuất",
    },
  },
  {
    id: "s3",
    title: "Kiến trúc thượng tầng (KTTT)",
    content: [
      "Kiến trúc thượng tầng là toàn bộ tư tưởng xã hội (chính trị, pháp luật, đạo đức, nghệ thuật, tôn giáo, triết học…) và các thiết chế xã hội tương ứng (Nhà nước, đảng phái, tổ chức chính trị – xã hội). Nhà nước là bộ phận quan trọng nhất của KTTT.",
    ],
    note: "Một câu gọn để nhớ: CSHT là ‘đời sống kinh tế’; KTTT là ‘đời sống tinh thần + thể chế’.",
    image: {
      src: "https://images.unsplash.com/photo-1526662092594-e98c1e356d6a?auto=format&fit=crop&w=1200&q=80",
      alt: "Tòa nhà chính phủ tượng trưng thiết chế",
    },
  },
  {
    id: "s4",
    title: "Quan hệ biện chứng: CSHT quyết định KTTT",
    content: [
      "CSHT quyết định sự ra đời, nội dung, tính chất và sự vận động của KTTT. Kinh tế thế nào → tư tưởng và thiết chế thế ấy. “Cái bụng quyết định cái đầu” – không phủ nhận tinh thần, mà xác định thứ tự ưu tiên lịch sử.",
    ],
    note: "Gắn với câu Marx: không phủ nhận tinh thần; chỉ chỉ ra thứ tự ưu tiên lịch sử của nhu cầu.",
    image: {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      alt: "Bánh răng và bóng đèn tượng trưng kinh tế quyết định ý thức",
    },
  },
  {
    id: "s5",
    title: "Dẫn chứng thực tiễn: CSHT → KTTT",
    content: [
      "Ở cấp độ cá nhân: thiếu tiền → ưu tiên làm thêm, kiếm sống; có thu nhập ổn định → mới tham gia CLB nghệ thuật, nghiên cứu khoa học. Ở cấp độ xã hội (Việt Nam): thời bao cấp CSHT thấp → tư duy quản lý, pháp luật cứng nhắc; sau Đổi mới CSHT thay đổi → KTTT (pháp luật, quản lý, hội nhập) đổi theo. Luận điểm: CSHT thay đổi → KTTT sớm hay muộn sẽ thay đổi theo.",
    ],
    note: "Có thể mời khán giả: “Ai từng đi làm thêm rồi mới ‘dám’ tham gia hoạt động?” giơ tay.",
    image: {
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      alt: "Quán cà phê nơi sinh viên vừa làm vừa học",
    },
  },
  {
    id: "s6",
    title: "Chiều ngược lại: KTTT tác động trở lại CSHT",
    content: [
      "KTTT có chức năng bảo vệ, củng cố, phát triển CSHT. Nhà nước là lực lượng tác động mạnh nhất thông qua pháp luật, chính sách kinh tế, bộ máy quản lý. KTTT có thể thúc đẩy hoặc kìm hãm sự phát triển của CSHT.",
    ],
    note: "Chuyển mạch: “Nếu CSHT là nền móng, KTTT là hệ ‘điều khiển’ của xã hội.”",
    image: {
      src: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
      alt: "Tòa nhà quốc hội tượng trưng chính sách",
    },
  },
  {
    id: "s7",
    title: "Dẫn chứng thực tiễn: KTTT → CSHT",
    content: [
      "Kinh tế số: công nghệ số, thương mại điện tử, kinh tế nền tảng (Grab, Shopee, ví điện tử…). Vai trò Nhà nước (KTTT): ban hành luật Thương mại điện tử, An ninh mạng, chính sách chuyển đổi số. Luật phù hợp → kinh tế phát triển; luật cứng nhắc → kìm hãm sản xuất.",
    ],
    note: "Có thể chốt: “KTTT không đứng ngoài kinh tế; nó can thiệp trực tiếp vào ‘luật chơi’.”",
    image: {
      src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
      alt: "Biểu tượng công nghệ số",
    },
  },
  {
    id: "s8",
    title: "Mini-game tương tác: Bạn là nhà hoạch định chính sách",
    content: [
      "Một quốc gia còn nghèo, kinh tế yếu, có nên đầu tư hàng nghìn tỷ xây nhà hát, bảo tàng hoành tráng không?",
    ],
    interactive: "poll",
    note: "Cho khán giả chọn A/B, sau đó chiếu phân tích: CSHT thấp mà KTTT vượt quá → mâu thuẫn, không bền vững.",
    image: {
      src: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1200&q=80",
      alt: "Nhà hát hiện đại tượng trưng đầu tư văn hóa",
    },
  },
  {
    id: "s9",
    title: "Tổng kết & thông điệp",
    content: [
      "Nhận định Marx không hạ thấp tinh thần; nó khẳng định nền kinh tế vững là điều kiện để xây dựng đời sống tinh thần cao đẹp. Phương pháp luận cho sinh viên: muốn làm khoa học, chính trị, cống hiến xã hội → trước hết học nghề vững, tham gia tốt vào sản xuất vật chất. Hiểu đúng CSHT ↔ KTTT để phân tích thực tiễn và ra quyết định hợp quy luật.",
    ],
    note: "Kết bài 1 câu: “Muốn ‘cái đầu’ bay cao, ‘cái bụng’ phải được nuôi dưỡng bằng một nền kinh tế lành mạnh.”",
    image: {
      src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      alt: "Sách và ánh sáng tượng trưng tri thức",
    },
  },
];

