// src/pages/management/other/model/OtherModal.jsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button } from 'antd';

const { Option } = Select;

const OtherAdminModal = ({ visible, onCancel, onSubmit, loading, isEdit = false, initialValues = {}, galaxies = [] }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [isEdit, initialValues, form]);

  return (
    <Modal
      title={<span className="font-bold text-amber-800">{isEdit ? 'Cập nhật Combo' : 'Tạo Combo mới'}</span>}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="name"
          label={<span className="font-bold text-amber-800">Tên Combo</span>}
          rules={[{ required: true, message: 'Vui lòng nhập tên combo' }]}
        >
          <Input placeholder="Nhập tên combo" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className="font-bold text-amber-800">Mô tả</span>}
        >
          <Input.TextArea rows={3} placeholder="Nhập mô tả combo" />
        </Form.Item>

        <Form.Item
          name="image_url"
          label={<span className="font-bold text-amber-800">Hình ảnh (URL)</span>}
        >
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item
          name="price"
          label={<span className="font-bold text-amber-800">Giá</span>}
          rules={[{ required: true, message: 'Vui lòng nhập giá combo' }]}
        >
          <InputNumber min={0} className="w-full" placeholder="Nhập giá" />
        </Form.Item>

        <Form.Item
          name="quantity"
          label={<span className="font-bold text-amber-800">Số lượng</span>}
          rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
        >
          <InputNumber min={1} className="w-full" placeholder="Nhập số lượng" />
        </Form.Item>

        <Form.Item
          name="galaxyId"
          label={<span className="font-bold text-amber-800">Galaxy</span>}
          rules={[{ required: true, message: 'Vui lòng chọn Galaxy' }]}
        >
          <Select placeholder="Chọn Galaxy">
            {galaxies.map(g => (
              <Option value={g.id} key={g.id}>{g.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label={<span className="font-bold text-amber-800">Trạng thái</span>}
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="ACTIVE">ACTIVE</Option>
            <Option value="INACTIVE">INACTIVE</Option>
          </Select>
        </Form.Item>

        <div className="text-right">
          <Button onClick={onCancel} className="mr-2">Hủy</Button>
          <Button
            htmlType="submit"
            type="primary"
            loading={loading}
            className="bg-amber-600 hover:bg-amber-700 font-bold rounded-full text-white"
          >
            {isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default OtherAdminModal;
