import React, { useState } from 'react';
import { Button, Descriptions, Card, Spin, List, Typography, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShowTimeByRoom } from '../../redux/slices/showTimeSlice';
import { useParams } from 'react-router-dom';

const { Text, Title } = Typography;

const RoomDetails = ({ room }) => {
 const roomId = useParams();
  const dispatch = useDispatch();
  const [showTimesVisible, setShowTimesVisible] = useState(false);

  const { showTimes = [], loading } = useSelector((state) => state.showTime || {});

  const handleViewShowTime = async () => {
    await dispatch(fetchShowTimeByRoom(roomId));
    setShowTimesVisible(true);
  };
  
  // Gom nhóm suất chiếu theo ngày
  const groupedShowTimes = showTimes.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <Card
      title={`Phòng ${room.name}`}
      bordered={true}
      style={{ maxWidth: 600, margin: '20px auto' }}
    >
      <Descriptions column={1}>
        <Descriptions.Item label="ID">{room.id}</Descriptions.Item>
        <Descriptions.Item label="Tên">{room.name}</Descriptions.Item>
        <Descriptions.Item label="Loại màn hình">{room.typeScreen}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{room.status}</Descriptions.Item>
        <Descriptions.Item label="Sức chứa">{room.capacity}</Descriptions.Item>
      </Descriptions>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Button
          type="primary"
          onClick={handleViewShowTime}
        >
          Xem lịch chiếu
        </Button>
      </div>

      {showTimesVisible && (
        <div style={{ marginTop: 30 }}>
          {loading && <Spin />}

          {!loading && Object.keys(groupedShowTimes).length === 0 && (
            <Text type="secondary">Chưa có lịch chiếu</Text>
          )}

          {!loading && Object.keys(groupedShowTimes).map((date) => (
            <div key={date}>
              <Divider />
              <Title level={4}>{date}</Title>
              <List
                dataSource={groupedShowTimes[date]}
                renderItem={(showTime) => (
                  <List.Item>
                    <List.Item.Meta
                      title={showTime.movieName}
                      description={`Giờ chiếu: ${showTime.time}`}
                    />
                  </List.Item>
                )}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RoomDetails;
