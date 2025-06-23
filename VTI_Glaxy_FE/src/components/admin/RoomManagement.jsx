import React, { useEffect, useState } from 'react';
import { Button, Spin, Tag, Card } from 'antd';
import { FiPlusCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms, createRoom } from '../../redux/slices/roomSlice';
import { useNavigate } from 'react-router-dom';
import CreateRoomModal from './model/CreateRoomModal';

const RoomManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rooms = [], loading, loadingCreate } = useSelector((state) => state.room || {});
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

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
  
  const handleCreateRoom = async (values) => {
    await dispatch(createRoom(values));
    setIsCreateModalVisible(false);
  };
  
  if (loading) return <Spin />;

  return (
    <div style={{ padding: 24 }}>
      <div className="flex justify-between items-center">
        <h2 style={{ marginBottom: 16 }}>Danh sách phòng chiếu</h2>
        <Button
          icon={<FiPlusCircle />}
          type="primary"
          onClick={() => setIsCreateModalVisible(true)}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white flex items-center justify-center space-x-2"
        >
          Tạo phòng mới
        </Button>
      </div>
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
            onClick={() => navigate(`/management/room/${room.id}`)}
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

      <CreateRoomModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onCreate={handleCreateRoom}
        loading={loadingCreate}
      />
    </div>
  );
};

export default RoomManagement;
