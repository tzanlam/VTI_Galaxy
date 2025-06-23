import React, { useState } from 'react';
import { Button, Spin, List, Typography, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchShowTimeByRoom } from '../../../redux/slices/showTimeSlice';
import { FiInfo, FiCalendar } from 'react-icons/fi';

const { Text, Title } = Typography;

const RoomDetails = ({ room }) => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const [showTimesVisible, setShowTimesVisible] = useState(false);
  const { showTimes = [], loading } = useSelector((state) => state.showTime || {});

  const handleViewShowTime = async () => {
    await dispatch(fetchShowTimeByRoom(roomId));
    setShowTimesVisible(true);
  };
  
  const groupedShowTimes = showTimes.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-xl bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 shadow-lg">
      <div className="flex items-center space-x-3">
        <FiInfo className="text-amber-700 text-3xl" />
        <h2 className="text-2xl font-bold text-amber-800">Phòng {room?.name}</h2>
      </div>
      <div className="text-amber-900 space-y-2 mt-3">
        <div><span className="font-semibold">ID:</span> {room?.id}</div>
        <div><span className="font-semibold">Tên:</span> {room?.name}</div>
        <div><span className="font-semibold">Loại màn hình:</span> {room?.typeScreen}</div>
        <div><span className="font-semibold">Trạng thái:</span> {room?.status}</div>
        <div><span className="font-semibold">Sức chứa:</span> {room?.capacity}</div>
      </div>

      <div className="text-center mt-6">
        <Button
          icon={<FiCalendar />}
          type="primary"
          onClick={handleViewShowTime}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white flex items-center justify-center space-x-2"
        >
          Xem lịch chiếu
        </Button>
      </div>

      {showTimesVisible && (
        <div className="mt-8">
          {loading && <Spin />}
          
          {!loading && Object.keys(groupedShowTimes).length === 0 && (
            <Text className="text-amber-800">Chưa có lịch chiếu</Text>
          )}
          
          {!loading && Object.keys(groupedShowTimes).map((date) => (
            <div key={date}>
              <Divider />
              <div className="flex items-center space-x-2">
                <FiCalendar className="text-amber-700" />
                <Title level={4} className="text-amber-800">{date}</Title>
              </div>
              <List
                dataSource={groupedShowTimes[date]}
                renderItem={(showTime) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<span className="font-bold text-amber-900">{showTime.movieName}</span>}
                      description={showTime.startTimes.length > 0
                        ? `Giờ chiếu: ${showTime.startTimes.join(', ')}`
                        : 'Chưa có giờ chiếu'}
                    />
                  </List.Item>
                )}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
