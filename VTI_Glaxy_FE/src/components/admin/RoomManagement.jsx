import React, { useEffect, useState } from 'react';
import { Button, Spin, Tag, Card } from 'antd';
import { FiPlusCircle, FiHome } from 'react-icons/fi';
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
    window.location.reload();
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
      style={{
        width: 220,
        backgroundColor: '#fff9e6',
        borderRadius: 8,
        boxShadow: '0px 2px 10px rgba(255, 215, 0, 0.3)',
        transition: 'all 0.3s',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = '0px 4px 15px rgba(255, 215, 0, 0.5)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = '0px 2px 10px rgba(255, 215, 0, 0.3)')
      }
      onClick={() => navigate(`/management/room/${room.id}`)}
    >
      <Card.Meta
        title={
          <div className="flex items-center space-x-2">
            <FiHome className="text-amber-600 text-lg" />
            <span className="font-bold">{room.name}</span>
          </div>
        }
        description={(
          <>
            {getStatusTag(room.status)}
            <div>Loại màn hình: {room.typeScreen}</div>
            <div>Galaxy: {room.galaxyName}</div>
          </>
        )}
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
