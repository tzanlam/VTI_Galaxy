import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeById } from '../../../redux/slices/employeeSlice';
import { Spin, Typography, Button } from 'antd';
import { FiInfo, FiArrowLeft, FiEdit } from 'react-icons/fi';
import EmployeeAdminModal from '../model/EmploeeModal';

const { Title, Text } = Typography;

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { employee, loading } = useSelector((state) => state.employee || {});

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeById(employeeId));
    }
  }, [dispatch, employeeId]);

  if (loading || !employee) return <Spin />;

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-xl bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        <FiInfo className="text-amber-700 text-3xl" />
        <Title level={3} className="!text-amber-800">Thông tin Nhân viên</Title>
      </div>

      <div className="text-amber-900 space-y-2">
        <p><Text strong>ID:</Text> {employee.id}</p>
        <p><Text strong>Họ tên:</Text> {employee.fullName}</p>
        <p><Text strong>Email:</Text> {employee.email}</p>
        <p><Text strong>Số điện thoại:</Text> {employee.phone}</p>
        <p><Text strong>Địa chỉ:</Text> {employee.address}</p>
        <p><Text strong>Ngày sinh:</Text> {employee.dateOfBirth}</p>
        <p><Text strong>Vị trí công việc:</Text> {employee.jobTitle}</p>
        <p><Text strong>Đánh giá:</Text> {employee.evaluate}</p>
        <p><Text strong>Số giờ làm:</Text> {employee.numberOfWorkingHours}</p>
        <p><Text strong>Ngày bắt đầu làm:</Text> {employee.startDateWorking}</p>
        <p><Text strong>Lương cơ bản:</Text> {employee.wage} VND</p>
        <p><Text strong>Lương thực nhận:</Text> {employee.salary} VND</p>
        <p><Text strong>Trạng thái:</Text> {employee.status}</p>
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <Button
          icon={<FiArrowLeft />}
          onClick={() => navigate('/management/employee')}
          className="bg-gray-300 hover:bg-gray-400 rounded-full font-bold"
        >
          Quay lại
        </Button>
        <Button
          icon={<FiEdit />}
          onClick={() => setIsEditModalVisible(true)}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
        >
          Chỉnh sửa
        </Button>
      </div>

      <EmployeeAdminModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        isEdit={true}
        onSubmit={() => setIsEditModalVisible(false)} // Xử lý cập nhật thực tế ở Management
        initialValues={employee}
        loading={false}
      />
    </div>
  );
};

export default EmployeeDetails;
