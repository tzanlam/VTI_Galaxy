import React, { useEffect, useState } from 'react';
import { Button, Spin, Tag, Card, Popconfirm, message } from 'antd';
import { FiPlusCircle, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGalaxies,
  createNewGalaxy,
  updateGalaxy,
  deleteGalaxy,
} from '../../redux/slices/galaxySlice';
import { useNavigate } from 'react-router-dom';
import CreateGalaxyModal from './model/GalaxyAdminModal';

const GalaxyManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { galaxies = [], loading, loadingCreate } = useSelector((state) => state.galaxy || {});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingGalaxy, setEditingGalaxy] = useState(null);

  useEffect(() => {
    dispatch(fetchGalaxies());
  }, [dispatch]);

  const getStatusTag = (status) => {
    return status === 'ACTIVE' ? (
      <Tag color="green">Hoạt động</Tag>
    ) : (
      <Tag color="red">Tạm ngưng</Tag>
    );
  };

  const handleCreate = () => {
    setIsEdit(false);
    setEditingGalaxy(null);
    setIsModalVisible(true);
  };

  const handleEdit = (galaxy) => {
    setIsEdit(true);
    setEditingGalaxy(galaxy);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteGalaxy(id));
    message.success('Xóa thành công!');
    dispatch(fetchGalaxies());
  };

  const handleSubmit = async (values) => {
    if (isEdit && editingGalaxy?.id) {
      await dispatch(updateGalaxy({ galaxyId: editingGalaxy.id, galaxyRequest: values }));
      message.success('Cập nhật thành công!');
    } else {
      await dispatch(createNewGalaxy(values));
      message.success('Tạo thành công!');
    }
    setIsModalVisible(false);
    setEditingGalaxy(null);
    dispatch(fetchGalaxies());
  };

  if (loading) return <Spin className="block mx-auto mt-10" />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-800">📍 Danh sách Galaxy</h2>
        <Button
          icon={<FiPlusCircle />}
          type="primary"
          onClick={handleCreate}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
        >
          Tạo Galaxy mới
        </Button>
      </div>

      <div className="flex flex-wrap gap-6">
        {galaxies.map((galaxy) => (
          <Card
            key={galaxy.id}
            hoverable
            className="transition duration-300 transform hover:-translate-y-1 hover:shadow-lg bg-yellow-50 border border-yellow-200 rounded-xl w-[300px]"
            cover={
              <img
                alt={galaxy.name}
                src={galaxy.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                className="h-[200px] w-full object-cover rounded-t-xl"
              />
            }
            onClick={() => navigate(`/management/galaxy/${galaxy.id}`)}
          >
            <Card.Meta
              title={<span className="font-semibold text-amber-900">{galaxy.name}</span>}
              description={
                <div className="text-sm text-gray-700 space-y-1 mt-1">
                  {getStatusTag(galaxy.status)}
                  <div>🏠 {galaxy.address}</div>
                  <div>🌆 {galaxy.city}</div>
                </div>
              }
            />
            <div
              className="flex justify-end space-x-2 mt-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Button icon={<FiEdit />} onClick={() => handleEdit(galaxy)} type="link" />
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa?"
                onConfirm={() => handleDelete(galaxy.id)}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button icon={<FiTrash2 />} danger type="link" />
              </Popconfirm>
            </div>
          </Card>
        ))}
      </div>

      <CreateGalaxyModal
        visible={isModalVisible}
        isEdit={isEdit}
        data={editingGalaxy}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingGalaxy(null);
        }}
        onSubmit={handleSubmit}
        loading={loadingCreate}
      />
    </div>
  );
};

export default GalaxyManagement;
