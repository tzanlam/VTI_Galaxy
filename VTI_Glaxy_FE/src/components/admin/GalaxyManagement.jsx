import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Table, Popconfirm, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchGalaxies, 
  createNewGalaxy, 
  updateGalaxy, 
  deleteGalaxy, 
  fetchGalaxyById, 
  clearGalaxySlice 
} from '../../redux/slices/galaxySlice';

const GalaxyManagement = () => {
  const dispatch = useDispatch();
  const { galaxies, loading, galaxy } = useSelector((state) => state.galaxy);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    dispatch(fetchGalaxies());
  }, [dispatch]);

  useEffect(() => {
    if (galaxy && isEdit) {
      form.setFieldsValue({
        name: galaxy.name,
        description: galaxy.description,
      });
    }
  }, [galaxy, form, isEdit]);

  const handleCreate = () => {
    form.resetFields();
    setIsEdit(false);
    setIsModalVisible(true);
  };

  const handleEdit = async (id) => {
    setIsEdit(true);
    setCurrentId(id);
    await dispatch(fetchGalaxyById(id));
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteGalaxy(id))
    message.success('Xóa galaxy thành công!');
    dispatch(fetchGalaxies());
  };

  if (!galaxies) {
   return <div>khong co du lieu</div>
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        await dispatch(updateGalaxy({ galaxyId: currentId, galaxyRequest: values }));
        message.success('Cập nhật galaxy thành công!');
      } else {
        await dispatch(createNewGalaxy(values));
        message.success('Tạo mới galaxy thành công!');
      }
      dispatch(clearGalaxySlice());
      setIsModalVisible(false);
      dispatch(fetchGalaxies());
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    dispatch(clearGalaxySlice());
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Tên Galaxy',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary" onClick={() => handleEdit(record.id)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="primary" danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản lý Galaxy</h2>
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: '20px' }}>
        Tạo mới Galaxy
      </Button>
      <Table 
        columns={columns} 
        dataSource={galaxies} 
        rowKey="id" 
        loading={loading}
      />

      <Modal
        title={isEdit ? "Chỉnh sửa Galaxy" : "Tạo mới Galaxy"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên Galaxy"
            rules={[{ required: true, message: 'Vui lòng nhập tên galaxy!' }]}
          >
            <Input placeholder="Nhập tên galaxy" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả galaxy" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GalaxyManagement;
