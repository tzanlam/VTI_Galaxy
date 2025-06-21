import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms } from '../../redux/slices/roomSlice';
import { Card, Tag, Spin } from 'antd';

const RoomManagement = () => {
  const dispatch = useDispatch();
  const { rooms , loading } = useSelector((state) => state.room || {});

  useEffect(() => {
    dispatch(fetchRooms());
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
      <h2 style={{ marginBottom: 16 }}>Danh sách phòng chiếu</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {rooms.map((room) => (
          <Card
            key={room.id}
            hoverable
            style={{ width: 240 }}
            cover={
              <img
                alt={room.name}
                src={room.image || 'https://via.placeholder.com/240x320?text=No+Image'}
                style={{ height: 320, objectFit: 'cover' }}
              />
            }
          >
            <Card.Meta
              title={room.name}
              description={
                <>
                  {getStatusTag(room.status)}
                  <div>Loại màn hình: {room.typeScreen}</div>
                  <div>Galaxy: {room.galaxyId}</div>
                </>
              }
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomManagement;
