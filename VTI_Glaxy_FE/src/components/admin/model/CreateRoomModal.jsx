import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGalaxies } from '../../../redux/slices/galaxySlice';

const CreateRoomModal = ({ visible, onCancel, onCreate, loading }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { galaxies = [], loading: loadingGalaxy } = useSelector((state) => state.galaxy || {});

  useEffect(() => {
    if (visible) {
      dispatch(fetchGalaxies());
    }
  }, [visible, dispatch]);

  return (
    <Modal
      title={<span className="font-bold text-amber-800">Tạo Phòng Mới</span>}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okButtonProps={{
        className: 'bg-amber-600 hover:bg-amber-700 font-bold rounded-full text-white',
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
          rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}
        >
          <Input placeholder="Nhập tên phòng" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Loại màn hình</span>}
          name="typeScreen"
          rules={[{ required: true, message: 'Vui lòng nhập loại màn hình' }]}
        >
          <Input placeholder="VD: 2D, 3D, IMAX..." />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Trạng thái</span>}
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="OPEN">Hoạt động</Select.Option>
            <Select.Option value="CLOSE">Ngừng hoạt động</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Sức chứa</span>}
          name="capacity"
          rules={[
            { required: true, message: 'Vui lòng nhập sức chứa' },
            { pattern: /^\d+$/, message: 'Vui lòng nhập số hợp lệ' },
          ]}
        >
          <Input placeholder="Nhập số lượng ghế" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Rạp Galaxy</span>}
          name="galaxyId"
          rules={[{ required: true, message: 'Vui lòng chọn Galaxy' }]}
        >
          {loadingGalaxy ? (
            <Spin />
          ) : (
            <Select placeholder="Chọn Galaxy">
              {galaxies.map((g) => (
                <Select.Option key={g.id} value={g.id}>
                  {g.name} - {g.city}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;
