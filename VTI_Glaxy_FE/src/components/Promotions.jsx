import React from "react";

const Promotions = () => {
  const promotions = [
    {
      id: 1,
      title: "Combo Popcorn & Nước",
      description: "Mua combo lớn chỉ với 99k, tiết kiệm 20%!",
      image: "https://picsum.photos/300/200?random=1",
      cta: "Mua Ngay",
      link: "/promotions/combo-deal",
    },
    {
      id: 2,
      title: "Vé Xem Phim Giá Sốc",
      description: "Vé 2D chỉ từ 50k vào thứ 4 hàng tuần!",
      image: "https://picsum.photos/300/200?random=2",
      cta: "Đặt Vé",
      link: "/promotions/ticket-deal",
    },
    {
      id: 3,
      title: "Ưu Đãi Thành Viên",
      description: "Tích điểm đổi quà, nhận vé miễn phí!",
      image: "https://picsum.photos/300/200?random=3",
      cta: "Tham Gia",
      link: "/promotions/membership",
    },
    {
      id: 4,
      title: "Khuyến Mãi IMAX",
      description: "Giảm 30% vé IMAX cho học sinh, sinh viên!",
      image: "https://picsum.photos/300/200?random=4",
      cta: "Khám Phá",
      link: "/promotions/imax-deal",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-24 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Tin Khuyến Mãi</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.target.src = "https://placehold.co/300x200";
                e.target.alt = "Hình ảnh không tải được";
              }}
            />
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-orange-500 transition-colors">
                {promo.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{promo.description}</p>
              <a
                href={promo.link}
                className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                {promo.cta}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions;
