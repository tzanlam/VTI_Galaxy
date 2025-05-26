import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../../redux/slices/movieSlice';
import { Card, Tag, Spin } from 'antd';

const MovieManagement = () => {
  const dispatch = useDispatch();
  const { movies = [], loading } = useSelector((state) => state.movie || {});

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

  if (loading) return <Spin />;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Danh sách phim</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {movies.map((movie) => (
          <Card
            key={movie.id}
            hoverable
            style={{ width: 240 }}
            cover={
              <img
                alt={movie.name}
                src={movie.image}
                style={{ height: 320, objectFit: 'cover' }}
              />
            }
          >
            <Card.Meta
              title={movie.name}
              description={getStatusTag(movie.status)}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MovieManagement;