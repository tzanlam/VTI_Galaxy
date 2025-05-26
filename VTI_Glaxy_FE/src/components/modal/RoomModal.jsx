import React from 'react';
import { Modal, Descriptions } from 'antd';

const RoomModal = ({ open, onCancel, room }) => {
  const defaultRoom = {
    name: 'Phòng chiếu mặc định',
    capacity: 120,
    screenType: '2D',
    soundSystem: 'Dolby Atmos',
    description: 'Đây là mô tả ví dụ cho phòng chiếu.'
  };

  const displayRoom = room || defaultRoom;

  return (
    <Modal
      title="Thông tin phòng chiếu"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tên phòng">{displayRoom.name}</Descriptions.Item>
        <Descriptions.Item label="Sức chứa">{displayRoom.capacity}</Descriptions.Item>
        <Descriptions.Item label="Loại màn hình">{displayRoom.screenType}</Descriptions.Item>
        <Descriptions.Item label="Hệ thống âm thanh">{displayRoom.soundSystem}</Descriptions.Item>
        <Descriptions.Item label="Mô tả">{displayRoom.description}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default RoomModal;
