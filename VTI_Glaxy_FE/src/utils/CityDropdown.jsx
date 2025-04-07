// // utils/CityDropdown.js
// import React, { useState } from "react";

// const CityDropdown = ({ onCityChange }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedCity, setSelectedCity] = useState("Toàn quốc");

//   const cities = [
//     "Toàn quốc",
//     "TP Hồ Chí Minh",
//     "Bến Tre",
//     "Đà Nẵng",
//     "Cà Mau",
//     "Nghệ An",
//     "Hải Phòng",
//     "Đắk Lắk",
//     "An Giang",
//     "Khánh Hòa",
//     "Bà Rịa - Vũng Tàu",
//     "Thừa Thiên Huế",
//     "Hà Nội",
//   ];

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleCitySelect = (city) => {
//     setSelectedCity(city);
//     setIsOpen(false);
//     onCityChange(city); // Gọi hàm onCityChange để truyền tỉnh/thành phố được chọn
//   };

//   return (
//     <div className="relative inline-block text-left">
//       <div>
//         <button
//           type="button"
//           className="inline-flex justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onClick={toggleDropdown}
//         >
//           {selectedCity}
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
//             {cities.map((city, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleCitySelect(city)}
//                 className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors duration-200 ${
//                   selectedCity === city ? "bg-blue-500 text-white" : ""
//                 }`}
//               >
//                 {city}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CityDropdown;
