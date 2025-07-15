import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Spin,
  Tag,
  Card,
  Select,
  Divider
} from 'antd';
import { FiUserPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import EmployeeAdminModal from './model/EmploeeModal';
import { fetchEmployees, postEmployee } from '../../redux/slices/employeeSlice';
import { fetchGalaxies } from '../../redux/slices/galaxySlice';

const { Option } = Select;

const EmployeeManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);

  const { employees = [], loading } = useSelector((state) => state.employee || {});
  const { galaxies = [] } = useSelector((state) => state.galaxy || {});

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchGalaxies());
  }, [dispatch]);

  const getStatusTag = (status) => (
    <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
  );

  const handleCreateEmployee = async (values) => {
    await dispatch(postEmployee(values));
    setIsCreateModalVisible(false);
    dispatch(fetchEmployees());
  };

  const filteredEmployees = useMemo(() => {
    return selectedGalaxy
      ? employees.filter((emp) => emp.galaxyId === selectedGalaxy)
      : employees;
  }, [employees, selectedGalaxy]);

  const groupByJobTitle = useMemo(() => {
    const groups = {
      MANAGER: [],
      RECEPTION: [],
    };
    filteredEmployees.forEach((emp) => {
      const title = emp.jobTitle?.toUpperCase();
      if (groups[title]) {
        groups[title].push(emp);
      }
    });
    return groups;
  }, [filteredEmployees]);

  const getGalaxyName = (id) => {
    return galaxies.find((g) => g.id === id)?.name || 'Không xác định';
  };

  if (loading) return <Spin className="mt-10" />;

  return (
    <div style={{ padding: 24 }}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-amber-700">Quản lý nhân viên</h2>
        <Button
          icon={<FiUserPlus />}
          type="primary"
          onClick={() => setIsCreateModalVisible(true)}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
        >
          Thêm nhân viên
        </Button>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <span className="text-amber-700 font-medium">Lọc theo rạp:</span>
        <Select
          value={selectedGalaxy}
          onChange={(val) => setSelectedGalaxy(val)}
          allowClear
          style={{ width: 250 }}
          placeholder="Chọn rạp Galaxy"
        >
          {galaxies.map((galaxy) => (
            <Option key={galaxy.id} value={galaxy.id}>
              {galaxy.name}
            </Option>
          ))}
        </Select>
      </div>

      {['MANAGER', 'RECEPTION'].map((jobTitle) => (
        <div key={jobTitle} className="mt-6">
          <Divider orientation="left" orientationMargin="0">
            <span className="text-amber-700 font-semibold">
              {jobTitle === 'MANAGER' ? 'Quản lý' : 'Lễ tân'}
            </span>
          </Divider>

          <div className="flex flex-wrap gap-4">
            {groupByJobTitle[jobTitle].length === 0 ? (
              <div className="text-gray-500 italic">Không có {jobTitle === 'MANAGER' ? 'quản lý' : 'lễ tân'} nào.</div>
            ) : (
              groupByJobTitle[jobTitle].map((employee) => (
                <Card
                  key={employee.id}
                  hoverable
                  style={{ width: 260, background: '#fff8e1', borderRadius: 10 }}
                  onClick={() => navigate(`/management/employee/${employee.id}`)}
                >
                  <Card.Meta
                    title={
                      <div className="font-bold text-amber-700">
                        {selectedGalaxy ? '' : `[${getGalaxyName(employee.galaxyId)}] `}
                        {employee.fullName}
                      </div>
                    }
                    description={
                      <>
                        {getStatusTag(employee.status)}
                        <div>Chức vụ: {employee.jobTitle}</div>
                        <div>Lương: {employee.salary?.toLocaleString()} VND</div>
                      </>
                    }
                  />
                </Card>
              ))
            )}
          </div>
        </div>
      ))}

      <EmployeeAdminModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateEmployee}
        loading={loading}
      />
    </div>
  );
};

export default EmployeeManagement;
