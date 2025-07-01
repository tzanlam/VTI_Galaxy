// File: OtherManagement.jsx
import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Spin, Popconfirm, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiEdit, FiTrash2, FiGift } from 'react-icons/fi';
import OtherAdminModal from './model/OtherModal';
import { createOther, deleteOther, fetchOtherById, fetchOthers, updateOther } from '../../redux/slices/otherSlice';

const OtherManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { others = [], loading } = useSelector((state) => state.other || {});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    dispatch(fetchOthers());
  }, [dispatch]);

  const handleCreate = () => {
    setIsEdit(false);
    setCurrentId(null);
    setIsModalVisible(true);
  };

  const handleEdit = async (id) => {
    setIsEdit(true);
    setCurrentId(id);
    await dispatch(fetchOtherById(id));
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteOther(id));
    message.success('Xóa combo thành công!');
    dispatch(fetchOthers());
  };

  const handleSubmit = async (values) => {
    if (isEdit && currentId) {
      await dispatch(updateOther({ otherId: currentId, otherRequest: values }));
      message.success('Cập nhật combo thành công!');
    } else {
      await dispatch(createOther(values));
      message.success('Tạo combo mới thành công!');
    }
    setIsModalVisible(false);
    dispatch(fetchOthers());
  };

  const getStatusTag = (status) => {
    if (status === 'ACTIVE') return <Tag color="green">Active</Tag>;
    return <Tag color="red">Inactive</Tag>;
  };

  if (loading) return <Spin />;

  return (
    <div style={{ padding: 24 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Danh sách Combo</h2>
        <Button
          icon={<FiPlusCircle />}
          type="primary"
          onClick={handleCreate}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full"
        >
          Thêm combo
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {others.map((other) => (
          <Card
            key={other.id}
            hoverable
            cover={<img alt={other.name} src={other.image_url} style={{ height: 180, objectFit: 'cover' }} />}
            onClick={() => navigate(`/management/other/${other.id}`)}
          >
            <Card.Meta
              title={<span className="font-bold text-lg text-amber-700">{other.name}</span>}
              description={
                <>
                  {getStatusTag(other.status)}
                  <div>Giá: {other.price} VND</div>
                  <div>Số lượng: {other.quantity}</div>
                </>
              }
            />
            <div className="flex justify-end space-x-2 mt-3" onClick={(e) => e.stopPropagation()}>
              <Button icon={<FiEdit />} onClick={() => handleEdit(other.id)} type="link" />
              <Popconfirm
                title="Xóa combo này?"
                onConfirm={() => handleDelete(other.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button icon={<FiTrash2 />} danger type="link" />
              </Popconfirm>
            </div>
          </Card>
        ))}
      </div>

      <OtherAdminModal
        visible={isModalVisible}
        isEdit={isEdit}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default OtherManagement;
