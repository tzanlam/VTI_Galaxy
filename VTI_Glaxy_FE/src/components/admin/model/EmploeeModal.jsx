import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchGalaxies } from "../../../redux/slices/galaxySlice";

const { Option } = Select;

const EmployeeAdminModal = ({
  visible,
  onCancel,
  onSubmit,
  isEdit,
  loading,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { galaxies } = useSelector((state) => state.galaxy);

  useEffect(() => {
    dispatch(fetchGalaxies());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dateOfBirth: dayjs(initialValues.dateOfBirth),
        startDateWorking: dayjs(initialValues.startDateWorking),
      });
    } else {
      form.resetFields();
    }
  }, [isEdit, initialValues, form]);

  return (
    <Modal
      title={
        <span className="font-bold text-amber-800">
          {isEdit ? "Cập nhật Nhân viên" : "Tạo mới Nhân viên"}
        </span>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      className="rounded-xl"
    >
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Form.Item
          label="Họ tên"
          name="fullName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="SĐT" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
        <Form.Item label="Ngày sinh" name="dateOfBirth" rules={[{ required: true }]}>
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Chức vụ" name="jobTitle">
          <Input />
        </Form.Item>
        <Form.Item label="Đánh giá" name="evaluate">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Số giờ làm việc" name="numberOfWorkingHours">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Ngày bắt đầu làm" name="startDateWorking" rules={[{ required: true }]}>
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Tiền công (VND/giờ)" name="wage">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Chi nhánh Galaxy"
          name="galaxyId"
          rules={[{ required: true }]}
        >
          <Select placeholder="Chọn chi nhánh">
            {galaxies.map((g) => (
              <Option key={g.id} value={g.id}>
                {g.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="text-right mt-4">
          <Button onClick={onCancel} className="mr-2">
            Hủy
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            loading={loading}
            className="bg-amber-600 hover:bg-amber-700 font-bold rounded-full text-white"
          >
            {isEdit ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EmployeeAdminModal;
