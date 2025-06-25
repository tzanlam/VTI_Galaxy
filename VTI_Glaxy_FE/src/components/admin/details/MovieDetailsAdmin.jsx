import { useEffect } from 'react';
import { Spin, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { FiFilm, FiEdit, FiArrowLeft, FiPlay } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById } from '../../../redux/slices/movieSlice';

const MovieDetailsAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { movieId } = useParams();
  const { movie, loading } = useSelector((state) => state.movie || {});

  useEffect(() => {
    dispatch(fetchMovieById(movieId)).unwrap();
  }, [movieId, dispatch]);

  if (loading) return <Spin />;

  if (!movie) return <div>Không tìm thấy phim</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-xl bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Ảnh bên trái */}
        <div className="md:w-1/3 flex justify-center items-start p-3">
          <img
            src={movie?.imageURL || 'https://via.placeholder.com/300x400.png?text=No+Image'}
            alt={movie?.name}
            className="rounded-lg shadow-lg"
            style={{ maxHeight: '400px' }}
          />
        </div>

        {/* Nội dung chi tiết bên phải */}
        <div className="md:w-2/3 p-3 text-amber-900 space-y-3">
          <div className="flex items-center space-x-3">
            <FiFilm className="text-amber-700 text-3xl" />
            <h2 className="text-3xl font-bold text-amber-800">{movie?.name}</h2>
          </div>

          <div className="text-lg"><span className="font-bold">ID:</span> {movie?.id}</div>
          <div className="text-lg"><span className="font-bold">Mô tả:</span> {movie?.description}</div>
          <div className="text-lg"><span className="font-bold">Thể loại:</span> {movie?.genre}</div>
          <div className="text-lg"><span className="font-bold">Diễn viên:</span> {movie?.actor}</div>
          <div className="text-lg"><span className="font-bold">Đạo diễn:</span> {movie?.director}</div>
          <div className="text-lg"><span className="font-bold">Thời lượng:</span> {movie?.duration}</div>
          <div className="text-lg"><span className="font-bold">Ngày phát hành:</span> {movie?.releaseDate}</div>
          <div className="text-lg"><span className="font-bold">Ngày tạo:</span> {movie?.createdDate}</div>
          <div className="text-lg"><span className="font-bold">Ngày chỉnh sửa:</span> {movie?.modifiedDate}</div>
          <div className="text-lg"><span className="font-bold">Quốc gia:</span> {movie?.country}</div>
          <div className="text-lg"><span className="font-bold">Nhà sản xuất:</span> {movie?.producer}</div>
          <div className="text-lg"><span className="font-bold">Đánh giá:</span> {movie?.rating}</div>
          <div className="text-lg"><span className="font-bold">Giới hạn độ tuổi:</span> {movie?.ageLimit}</div>
          <div className="text-lg"><span className="font-bold">Trạng thái:</span> {movie?.status}</div>

          {/* Links ảnh/trailer */}
          <div className="flex space-x-4 mt-4">
            <Button
              icon={<FiPlay />}
              onClick={() => window.open(movie?.trailerURL, '_blank')}
              className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
            >
              Xem Trailer
            </Button>
            <Button
              icon={<FiEdit />}
              onClick={() => navigate(`/management/movie/edit/${movie?.id}`)}
              className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
            >
              Chỉnh Sửa
            </Button>
            <Button
              icon={<FiArrowLeft />}
              onClick={() => navigate('/management/movie')}
              className="bg-gray-600 hover:bg-gray-700 rounded-full font-bold text-white"
            >
              Quay Lại
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsAdmin;
