// moviesData.js
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
  // Bạn có thể thêm các phim khác như "Quỷ Nhập Tràng" hoặc "Mickey 17" nếu muốn
  {
    id: 4,
    title: "Quỷ Nhập Tràng",
    image: quyNhapTrang,
    rating: 8.0,
    genre: "Kinh dị",
    duration: "110 phút",
    description: "Một câu chuyện ma quái đầy ám ảnh.",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    showtimes: [
      { day: "Thứ Sáu", times: ["14:00", "18:00", "22:00"] },
      { day: "Thứ Bảy", times: ["13:00", "17:00", "21:00"] },
    ],
  },
  {
    id: 5,
    title: "Mickey 17",
    image: mickey17,
    rating: 8.5,
    genre: "Khoa học viễn tưởng",
    duration: "130 phút",
    description: "Một cuộc phiêu lưu ngoài không gian đầy kịch tính.",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    showtimes: [
      { day: "Chủ Nhật", times: ["11:00", "15:00", "19:00"] },
      { day: "Thứ Hai", times: ["12:00", "16:00", "20:00"] },
    ],
  },
];