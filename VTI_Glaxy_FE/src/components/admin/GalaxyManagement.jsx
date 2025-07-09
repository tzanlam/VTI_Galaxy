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
  const [editingGalaxy, setEditingGalaxy] = useState(null); // ✅ Dùng local state thay Redux

  useEffect(() => {
    dispatch(fetchGalaxies());
  }, [dispatch]);

  const getStatusTag = (status) => {
    if (status === 'ACTIVE') return <Tag color="green">Active</Tag>;
    return <Tag color="red">Inactive</Tag>;
  };

  const handleCreate = () => {
    setIsEdit(false);
    setEditingGalaxy(null); // 👈 reset
    setIsModalVisible(true);
  };

  const handleEdit = (galaxy) => {
    setIsEdit(true);
    setEditingGalaxy(galaxy); // 👈 truyền toàn bộ object vào modal
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

  if (loading) return <Spin />;

  return (
    <div style={{ padding: 24 }}>
      <div className="flex justify-between items-center">
        <h2 style={{ marginBottom: 16 }}>Danh sách Galaxy</h2>
        <Button
          icon={<FiPlusCircle />}
          type="primary"
          onClick={handleCreate}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
        >
          Tạo Galaxy mới
        </Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {galaxies.map((galaxy) => (
          <Card
            key={galaxy.id}
            hoverable
            style={{ width: 300 }}
            cover={
              <img
                alt={galaxy.name}
                src={galaxy.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                style={{ height: 200, objectFit: 'cover' }}
              />
            }
            onClick={() => navigate(`/management/galaxy/${galaxy.id}`)}
          >
            <Card.Meta
              title={galaxy.name}
              description={
                <>
                  {getStatusTag(galaxy.status)}
                  <div>Địa chỉ: {galaxy.address}</div>
                  <div>Thành phố: {galaxy.city}</div>
                </>
              }
            />
            <div className="flex justify-end space-x-2 mt-3" onClick={(e) => e.stopPropagation()}>
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
        data={editingGalaxy} // ✅ truyền trực tiếp object
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
