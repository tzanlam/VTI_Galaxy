import React, { useEffect, useState } from 'react';
import { Button, Spin, Tag, Card } from 'antd';
import { FiPlusCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, postMovie } from '../../redux/slices/movieSlice';
import { useNavigate } from 'react-router-dom';
import CreateMovieModal from './model/CreateMovieModal';

const MovieManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { movies = [], loading, loadingCreate } = useSelector((state) => state.movie || {});
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const getStatusTag = (status) => {
    if (status === 'ACTIVE') {
      return <Tag color="green">Active</Tag>;
    } else {
      return <Tag color="red">Inactive</Tag>;
    }
  };
  
  const handleCreate = async (values) => {
    await dispatch(postMovie(values));
    setIsModalVisible(false);
  };
  
  if (loading) return <Spin />;

  return (
    <div style={{ padding: 24 }}>
      <div className="flex justify-between items-center">
        <h2 style={{ marginBottom: 16 }}>Danh sách phim</h2>
        <Button
          icon={<FiPlusCircle />}
          type="primary"
          onClick={() => setIsModalVisible(true)}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white flex items-center justify-center space-x-2"
        >
          Tạo phim mới
        </Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {movies.map((movie) => (
          <Card
            key={movie.id}
            hoverable
            style={{ width: 240 }}
            cover={
              <img
                alt={movie.name}
                src={movie.imageURL}
                style={{ height: 320, objectFit: 'cover' }}
              />
            }
            onClick={() => 
              navigate(`/management/movie/${movie.id}`)}
          >
            <Card.Meta
              title={movie.name}
              description={
                <>
                  {getStatusTag(movie.status)}
                  <div>Thể loại: {movie.genre}</div>
                  <div>Đạo diễn: {movie.director}</div>
                </>
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
