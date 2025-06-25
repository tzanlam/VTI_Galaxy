import { useEffect } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { FiFilm } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById } from '../../../redux/slices/movieSlice';


const MovieDetailsAdmin = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams();
  const { movie, loading }  = useSelector((state) => state.movie || {});

  useEffect(() => {
    dispatch(fetchMovieById(movieId)).unwrap();
  }, [movieId, dispatch]);

  if (loading) return <Spin />;

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-xl bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 shadow-lg">
      <div className="flex items-center space-x-3">
        <FiFilm className="text-amber-700 text-3xl" />
        <h2 className="text-2xl font-bold text-amber-800">Phim: {movie?.name}</h2>
      </div>

      <div className="text-amber-900 space-y-2 mt-3">
        <div><span className="font-bold">ID:</span> {movie?.id}</div>
        <div><span className="font-bold">Mô tả:</span> {movie?.description}</div>
        <div><span className="font-bold">Thể loại:</span> {movie?.genre}</div>
        <div><span className="font-bold">Diễn viên:</span> {movie?.actor}</div>
        <div><span className="font-bold">Đạo diễn:</span> {movie?.director}</div>
        <div><span className="font-bold">Thời lượng:</span> {movie?.duration}</div>
        <div><span className="font-bold">Ngày phát hành:</span> {movie?.releaseDate}</div>
        <div><span className="font-bold">Ngày tạo:</span> {movie?.createdDate}</div>
        <div><span className="font-bold">Ngày chỉnh sửa:</span> {movie?.modifiedDate}</div>
        <div><span className="font-bold">Ảnh:</span> <a href={movie?.imageURL} target="_blank" rel="noreferrer">Xem ảnh</a></div>
        <div><span className="font-bold">Trailer:</span> <a href={movie?.trailerURL} target="_blank" rel="noreferrer">Xem trailer</a></div>
        <div><span className="font-bold">Quốc gia:</span> {movie?.country}</div>
        <div><span className="font-bold">Nhà sản xuất:</span> {movie?.producer}</div>
        <div><span className="font-bold">Đánh giá:</span> {movie?.rating}</div>
        <div><span className="font-bold">Giới hạn độ tuổi:</span> {movie?.ageLimit}</div>
        <div><span className="font-bold">Trạng thái:</span> {movie?.status}</div>
      </div>
    </div>
  );
};

export default MovieDetailsAdmin;
