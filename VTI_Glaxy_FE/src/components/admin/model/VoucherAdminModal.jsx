import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, InputNumber } from 'antd';
import dayjs from 'dayjs';

const VoucherModal = ({ visible, onCancel, onSubmit, loading, isEdit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        start_date: dayjs(initialValues.start_date),
        end_date: dayjs(initialValues.end_date),
      });
    } else {
      form.resetFields();
    }
  }, [isEdit, initialValues, form]);

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      start_date: values.start_date.toISOString(),
      end_date: values.end_date.toISOString(),
    };
    onSubmit(formattedValues);
  };

  return (
    <Modal
      title={<span className="font-bold text-amber-800">{isEdit ? 'Chỉnh sửa Voucher' : 'Tạo mới Voucher'}</span>}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label={<span className="font-bold text-amber-800">Tên voucher</span>}
          name="voucherName"
          rules={[{ required: true, message: 'Vui lòng nhập tên voucher' }]}
        >
          <Input placeholder="Nhập tên voucher" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Giảm giá (%)</span>}
          name="discount"
          rules={[{ required: true, message: 'Vui lòng nhập giảm giá' }]}
        >
          <InputNumber min={1} max={100} className="w-full" placeholder="Nhập % giảm giá" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Ngày bắt đầu</span>}
          name="startDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Ngày kết thúc</span>}
          name="endDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <div className="text-right mt-4">
          <Button onClick={onCancel} className="mr-2">Hủy</Button>
          <Button htmlType="submit" type="primary" loading={loading} className="bg-amber-600 hover:bg-amber-700 font-bold text-white rounded-full">
            {isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default VoucherModal;
