import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const CreateRoomModal = ({ visible, onCancel, onCreate, loading }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={<span className="font-bold text-amber-800">Tạo Phòng Mới</span>}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okButtonProps={{
        className:
          'bg-amber-600 hover:bg-amber-700 font-bold rounded-full text-white',
      }}
      cancelButtonProps={{
        className: 'font-bold rounded-full',
      }}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onCreate}
      >
        <Form.Item
          label={<span className="font-bold text-amber-800">Tên phòng</span>}
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên phòng' },
          ]}
        >
          <Input placeholder="Nhập tên phòng" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Loại màn hình</span>}
          name="typeScreen"
          rules={[
            { required: true, message: 'Vui lòng nhập loại màn hình' },
          ]}
        >
          <Input placeholder="Nhập loại màn hình (VD: 3D)" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Trạng thái</span>}
          name="status"
          rules={[
            { required: true, message: 'Vui lòng chọn trạng thái' },
          ]}
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="ACTIVE">Hoạt động</Select.Option>
            <Select.Option value="INACTIVE">Ngừng hoạt động</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Sức chứa</span>}
          name="capacity"
          rules={[
            { required: true, message: 'Vui lòng nhập sức chứa' },
            { pattern: /^\d+$/, message: 'Vui lòng nhập số' },
          ]}
        >
          <Input placeholder="Nhập số lượng ghế" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;
