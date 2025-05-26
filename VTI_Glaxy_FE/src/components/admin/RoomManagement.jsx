import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Typography, Spin } from 'antd';
import { fetchRooms } from '../../redux/slices/roomSlice';

const { Title } = Typography;

const RoomManagement = () => {
  const dispatch = useDispatch();
  const { rooms, loading } = useSelector((state) => state.room);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  // Nhóm room theo galaxyId
  const groupByGalaxy = () => {
    const grouped = {};
    rooms.forEach((room) => {
      if (!grouped[room.galaxyId]) {
        grouped[room.galaxyId] = [];
      }
      grouped[room.galaxyId].push(room);
    });
    return grouped;
  };

  const groupedRooms = groupByGalaxy();

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Quản lý phòng chiếu</Title>

      {loading ? (
        <Spin />
      ) : (
        Object.keys(groupedRooms).map((galaxyId) => (
          <div key={galaxyId} style={{ marginBottom: 40 }}>
            <Title level={4}>Galaxy {galaxyId}</Title>
            <Row gutter={[16, 16]}>
              {groupedRooms[galaxyId].map((room) => (
                <Col key={room.id} xs={24} sm={12} md={8} lg={6}>
                  <Card title={room.name} bordered={true}>
                    <p>Loại màn hình: {room.typeScreen}</p>
                    <p>Trạng thái: {room.status}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))
      )}
    </div>
  );
};

export default RoomManagement;
