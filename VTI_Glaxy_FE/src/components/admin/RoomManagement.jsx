import React, { useEffect, useState } from 'react';
import { Button, Spin, Tag, Card, Divider } from 'antd';
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

  // 🌟 Group rooms by galaxyId
  const groupedRooms = rooms.reduce((acc, room) => {
    const key = `${room.galaxyId} - ${room.galaxyName}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(room);
    return acc;
  }, {});

  return (
    <div style={{ padding: 24 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-amber-700">Danh sách phòng chiếu</h2>
        <Button
          icon={<FiPlusCircle />}
          type="primary"
          onClick={() => setIsCreateModalVisible(true)}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white flex items-center space-x-2"
        >
          Tạo phòng mới
        </Button>
      </div>

      {Object.entries(groupedRooms).map(([galaxyKey, roomList]) => (
        <div key={galaxyKey} className="mb-8">
          <Divider orientation="left" orientationMargin="0" className="text-lg font-bold text-amber-600">
            {galaxyKey.split(' - ')[1]} ({roomList.length} phòng)
          </Divider>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {roomList.map((room) => (
              <Card
                key={room.id}
                hoverable
                style={{
                  width: 240,
                  backgroundColor: '#fffbe6',
                  borderRadius: 12,
                  boxShadow: '0px 2px 8px rgba(255, 193, 7, 0.3)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0px 4px 15px rgba(255, 193, 7, 0.5)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = '0px 2px 8px rgba(255, 193, 7, 0.3)')
                }
                onClick={() => navigate(`/management/room/${room.id}`)}
              >
                <Card.Meta
                  title={
                    <div className="flex items-center space-x-2">
                      <FiHome className="text-amber-600 text-lg" />
                      <span className="font-bold text-amber-800">{room.name}</span>
                    </div>
                  }
                  description={
                    <div className="text-gray-700 space-y-1 mt-2">
                      {getStatusTag(room.status)}
                      <div>🎬 Loại màn hình: <strong>{room.typeScreen}</strong></div>
                      <div>🏢 Galaxy: {room.galaxyName}</div>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        </div>
      ))}

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
