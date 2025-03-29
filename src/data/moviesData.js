import snowWhite from "../assets/show-white.jpg";
import lastStop from "../assets/last-stop.jpg";
import quyNhapTrang from "../assets/quy-nhap-trang.jpg";
import mickey17 from "../assets/mickey-17.jpg";
import OP from "../assets/one-piece.jpg";

export const movies = [
  {
    id: 1,
    title: "Nàng Bạch Tuyết",
    image: snowWhite,
    rating: 7.7,
    genre: "Gia đình",
    duration: "120 phút",
    description: "Một câu chuyện cổ tích về nàng công chúa và bảy chú lùn.",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    showtimes: [
      { day: "Thứ Hai", times: ["10:00", "14:00", "18:00"] },
      { day: "Thứ Ba", times: ["11:00", "15:00", "19:00"] },
    ],
  },
  {
    id: 2,
    title: "Nhà Ga Ma Chô",
    image: lastStop,
    rating: 7.8,
    genre: "Kinh dị",
    duration: "95 phút",
    description: "Một hành trình kinh dị tại nhà ga bị bỏ hoang.",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    showtimes: [
      { day: "Thứ Tư", times: ["13:00", "17:00", "21:00"] },
      { day: "Thứ Năm", times: ["12:00", "16:00", "20:00"] },
    ],
  },
  {
    id: 3,
    title: "One Piece",
    image: OP,
    rating: 10,
    genre: "Phiêu lưu",
    duration: "95 phút",
    description: "Một cuộc phiêu lưu trên biển cả tìm kho báu One Piece.",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    showtimes: [
      { day: "Thứ Tư", times: ["13:00", "17:00", "21:00"] },
      { day: "Thứ Năm", times: ["12:00", "16:00", "20:00"] },
    ],
  },
];