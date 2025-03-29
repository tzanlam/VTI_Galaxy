// // Ví dụ: Thêm xử lý lỗi vào một component hoặc hàm bất kỳ
// // Đây là cách bạn có thể chuyển hướng đến trang lỗi từ bất kỳ component nào

// import { useNavigate } from "react-router-dom";

// // Ví dụ trong một component tìm kiếm
// const SearchResults = () => {
//   const navigate = useNavigate();
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Giả sử bạn có một hàm tìm kiếm
//   const searchMovies = async (keyword) => {
//     try {
//       setLoading(true);

//       // Giả lập API call
//       // const response = await api.searchMovies(keyword);
//       // const data = await response.json();

//       // Giả sử không tìm thấy kết quả nào
//       const data = { results: [] };

//       if (data.results.length === 0) {
//         // Chuyển hướng đến trang lỗi với thông báo tùy chỉnh
//         navigate("/error", {
//           state: {
//             message: `Không tìm thấy kết quả nào cho "${keyword}". Vui lòng thử lại với từ khóa khác.`,
//           },
//         });
//         return;
//       }

//       setResults(data.results);
//     } catch (err) {
//       setError(err);
//       // Xử lý lỗi kỹ thuật
//       navigate("/error", {
//         state: {
//           message: "Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.",
//         },
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Phần còn lại của component
//   return <div>{/* Component content */}</div>;
// };

// // Ví dụ cho trường hợp link không hoạt động
// const handleBrokenLink = (e, navigate) => {
//   e.preventDefault();
//   navigate("/error", {
//     state: {
//       message: "Liên kết này tạm thời không hoạt động hoặc đang được bảo trì.",
//     },
//   });
// };

// // Sử dụng cho button hoặc link
// // <button onClick={(e) => handleBrokenLink(e, navigate)}>Coming Soon</button>
