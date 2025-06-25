import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const GalaxyAdminModal = ({ 
  visible, 
  isEdit, 
  onCancel, 
  onSubmit, 
  loading, 
  data
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit && data) {
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [isEdit, data, form]);

  return (
    <Modal
      title={<span className="font-bold text-amber-800">{isEdit ? 'Chỉnh sửa Galaxy' : 'Tạo mới Galaxy'}</span>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      className="rounded-xl"
    >
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Form.Item
          label={<span className="font-bold text-amber-800">Tên Galaxy</span>}
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên galaxy' }]}
        >
          <Input placeholder="Nhập tên Galaxy" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Mô tả</span>}
          name="description"
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả Galaxy" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Ảnh</span>}
          name="image"
        >
          <Input placeholder="URL ảnh Galaxy" />
        </Form.Item>

        <div className="text-right mt-4">
          <Button onClick={onCancel} className="mr-2">Hủy</Button>
          <Button
            htmlType="submit"
            type="primary"
            loading={loading}
            className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
          >
            {isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default GalaxyAdminModal;
