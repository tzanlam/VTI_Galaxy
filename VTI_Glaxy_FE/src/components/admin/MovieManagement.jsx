import React, { useEffect, useState, useMemo } from 'react';
import { Button, Spin, Tag, Card, Select, Row, Col } from 'antd';
import { FiPlusCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, postMovie } from '../../redux/slices/movieSlice';
import { useNavigate } from 'react-router-dom';
import CreateMovieModal from './model/CreateMovieModal';

const { Option } = Select;

const MovieManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { movies = [], loading, loadingCreate } = useSelector((state) => state.movie || {});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterGenre, setFilterGenre] = useState('ALL');
  const [filterAge, setFilterAge] = useState('ALL');

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleCreate = async (values) => {
    await dispatch(postMovie(values));
    setIsModalVisible(false);
  };

  const getStatusTag = (status) => {
    return status === 'ACTIVE' ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>;
  };

  // Lọc movie theo các filter đã chọn
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchStatus = filterStatus === 'ALL' || movie.status === filterStatus;
      const matchGenre = filterGenre === 'ALL' || movie.genre === filterGenre;
      const matchAge = filterAge === 'ALL' || movie.ageLimit === filterAge;
      return matchStatus && matchGenre && matchAge;
    });
  }, [movies, filterStatus, filterGenre, filterAge]);

  // Lấy danh sách genre và age limit duy nhất để render Select option
  const genres = [...new Set(movies.map((m) => m.genre).filter(Boolean))];
  const ageLimits = [...new Set(movies.map((m) => m.ageLimit).filter(Boolean))];

  if (loading) return <Spin className="block mx-auto mt-10" />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-800">🎬 Danh sách phim</h2>
        <Button
          icon={<FiPlusCircle />}
          type="primary"
          onClick={() => setIsModalVisible(true)}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
        >
          Tạo phim mới
        </Button>
      </div>

      {/* Bộ lọc */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 shadow-sm">
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <label className="block mb-1 text-sm font-medium text-amber-700">Lọc theo trạng thái</label>
            <Select
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              className="w-full"
            >
              <Option value="ALL">Tất cả</Option>
              <Option value="ACTIVE">Đang chiếu</Option>
              <Option value="INACTIVE">Ngừng chiếu</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <label className="block mb-1 text-sm font-medium text-amber-700">Thể loại</label>
            <Select
              value={filterGenre}
              onChange={(value) => setFilterGenre(value)}
              className="w-full"
              allowClear
            >
              <Option value="ALL">Tất cả</Option>
              {genres.map((genre) => (
                <Option key={genre} value={genre}>
                  {genre}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <label className="block mb-1 text-sm font-medium text-amber-700">Độ tuổi</label>
            <Select
              value={filterAge}
              onChange={(value) => setFilterAge(value)}
              className="w-full"
            >
              <Option value="ALL">Tất cả</Option>
              {ageLimits.map((age) => (
                <Option key={age} value={age}>
                  {age}+
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      {/* Danh sách phim */}
      <div className="flex flex-wrap gap-6">
        {filteredMovies.map((movie) => (
          <Card
            key={movie.id}
            hoverable
            className="transition duration-300 transform hover:-translate-y-1 hover:shadow-lg bg-yellow-50 border border-yellow-200 rounded-xl w-[240px]"
            cover={
              <img
                alt={movie.name}
                src={movie.imageURL}
                className="h-[320px] object-cover rounded-t-xl"
              />
            }
            onClick={() => navigate(`/management/movie/${movie.id}`)}
          >
            <Card.Meta
              title={<span className="font-semibold text-amber-900">{movie.name}</span>}
              description={
                <div className="text-sm text-gray-700 space-y-1 mt-1">
                  {getStatusTag(movie.status)}
                  <div>🎭 Thể loại: {movie.genre}</div>
                  <div>🎬 Đạo diễn: {movie.director}</div>
                  <div>👶 Độ tuổi: {movie.ageLimit}+</div>
                </div>
              }
            />
          </Card>
        ))}
      </div>

      <CreateMovieModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleCreate}
        loading={loadingCreate}
      />
    </div>
  );
};

export default MovieManagement;
