// EmployeeManagement.jsx
import React, { useEffect, useState } from 'react';
import { Button, Spin, Tag, Card } from 'antd';
import { FiUserPlus, FiUser } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EmployeeAdminModal from './model/EmploeeModal';
import { fetchEmployees, postEmployee } from '../../redux/slices/employeeSlice';

const EmployeeManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employees = [], loading, loadingCreate } = useSelector((state) => state.employee || {});
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const getStatusTag = (status) => (
    <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
  );

  const handleCreateEmployee = async (values) => {
    await dispatch(postEmployee(values));
    setIsCreateModalVisible(false);
    window.location.reload();
  };

  if (loading) return <Spin />;

  return (
    <div style={{ padding: 24 }}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-amber-700">Danh sách nhân viên</h2>
        <Button
          icon={<FiUserPlus />}
          type="primary"
          onClick={() => setIsCreateModalVisible(true)}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
        >
          Thêm nhân viên
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        {employees.map((employee) => (
          <Card
            key={employee.id}
            hoverable
            style={{ width: 260, background: '#fff8e1', borderRadius: 10 }}
            onClick={() => navigate(`/management/employee/${employee.id}`)}
          >
            <Card.Meta
              title={<div className="font-bold text-amber-700">{employee.fullName}</div>}
              description={
                <>
                  {getStatusTag(employee.status)}
                  <div>Chức vụ: {employee.jobTitle}</div>
                  <div>Email: {employee.email}</div>
                </>
              }
            />
          </Card>
        ))}
      </div>

      <EmployeeAdminModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateEmployee}
        loading={loadingCreate}
      />
    </div>
  );
};

export default EmployeeManagement;
