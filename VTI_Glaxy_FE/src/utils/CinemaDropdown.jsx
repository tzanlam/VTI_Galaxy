// // utils/CinemaDropdown.js
// import React, { useState } from "react";

// const cinemaLocations = {
//   "Toàn quốc": [],
//   "TP Hồ Chí Minh": [
//     { name: "Galaxy Nguyễn Du", address: "116 Nguyễn Du, Quận 1" },
//     { name: "Galaxy Nguyễn Trãi", address: "230 Nguyễn Trãi, Quận 1" },
//     {
//       name: "Galaxy Nguyễn Hồng Đào",
//       address: "246 Nguyễn Hồng Đào, Quận Tân Bình",
//     },
//     { name: "Galaxy Sala", address: "Quận 2" },
//   ],
//   "Hà Nội": [
//     {
//       name: "Galaxy Hoàn Kiếm",
//       address:
//         "Floor 5, Song Hong Sun Building, 23 Phan Chu Trinh, Hoan Kiem District",
//     },
//     { name: "Galaxy IMAX Hanoi", address: "Đang xây dựng, dự kiến mở Q2 2025" },
//   ],
//   "Nghệ An": [
//     {
//       name: "Galaxy Vinh",
//       address:
//         "Lầu 5, Trung tâm thương mại giải trí HUB, số 1 Lê Hồng Phong, TP Vinh",
//     },
//   ],
//   "Đà Nẵng": [{ name: "Galaxy Đà Nẵng", address: "Đà Nẵng" }],
//   "Cà Mau": [{ name: "Galaxy Cần Thơ", address: "Cần Thơ (gần Cà Mau)" }],
//   "Hải Phòng": [{ name: "Galaxy Hải Phòng", address: "Hải Phòng" }],
//   "Đắk Lắk": [{ name: "Galaxy Đắk Lắk", address: "Đắk Lắk" }],
//   "An Giang": [{ name: "Galaxy An Giang", address: "An Giang" }],
//   "Khánh Hòa": [{ name: "Galaxy Nha Trang", address: "Nha Trang, Khánh Hòa" }],
//   "Bà Rịa - Vũng Tàu": [{ name: "Galaxy Vũng Tàu", address: "Vũng Tàu" }],
//   "Thừa Thiên Huế": [{ name: "Galaxy Huế", address: "Thừa Thiên Huế" }],
//   "Bến Tre": [{ name: "Galaxy Bến Tre", address: "Bến Tre" }],
// };

// const CinemaDropdown = ({ selectedCity }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedCinema, setSelectedCinema] = useState("Chọn rạp");

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleCinemaSelect = (cinema) => {
//     setSelectedCinema(cinema.name);
//     setIsOpen(false);
//   };

//   const cinemas = cinemaLocations[selectedCity] || [];

//   if (selectedCity === "Toàn quốc" || cinemas.length === 0) {
//     return null; // Không hiển thị dropdown rạp nếu chọn "Toàn quốc" hoặc không có rạp
//   }

//   return (
//     <div className="relative inline-block text-left">
//       <div>
//         <button
//           type="button"
//           className="inline-flex justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onClick={toggleDropdown}
//         >
//           {selectedCinema}
//           <svg
//             className={`w-5 h-5 ml-2 -mr-1 transition-transform duration-200 ${
//               isOpen ? "rotate-180" : ""
//             }`}
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//             aria-hidden="true"
//           >
//             <path
//               fillRule="evenodd"
//               d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>
//       </div>

//       {isOpen && (
//         <div className="absolute z-10 w-48 mt-2 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//           <div className="py-1">
//             {cinemas.map((cinema, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleCinemaSelect(cinema)}
//                 className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors duration-200 ${
//                   selectedCinema === cinema.name ? "bg-blue-500 text-white" : ""
//                 }`}
//               >
//                 {cinema.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CinemaDropdown;
