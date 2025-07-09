import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, Button, Image } from 'antd';
import { useDispatch } from 'react-redux';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { postImage } from "../../../redux/slices/supportSlice";

const GalaxyAdminModal = ({
  visible,
  isEdit,
  onCancel,
  onSubmit,
  loading,
  data
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);

  const [previewImage, setPreviewImage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (isEdit && data) {
      form.setFieldsValue({
        name: data.name,
        address: data.address,
        city: data.city,
        image: data.image,
      });
      setPreviewImage(data.image || null);
    } else {
      form.resetFields();
      setPreviewImage(null);
    }
  }, [isEdit, data, form]);

  const handleImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await dispatch(postImage(formData)).unwrap();
      const imageUrl = res?.url || res?.data?.url || null;
      if (imageUrl) {
        form.setFieldsValue({ image: imageUrl });
        setPreviewImage(imageUrl);
      }
    } catch (err) {
      console.error("Upload ảnh thất bại:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleImageUpload(file);
  };

  const handleRemoveImage = () => {
    form.setFieldsValue({ image: '' });
    setPreviewImage(null);
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      title={<span className="font-bold text-amber-800">{isEdit ? "Chỉnh sửa Galaxy" : "Tạo mới Galaxy"}</span>}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label={<span className="font-bold text-amber-800">Tên Galaxy</span>}
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên Galaxy' }]}
        >
          <Input placeholder="Nhập tên Galaxy" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Thành phố</span>}
          name="city"
        >
          <Input placeholder="Nhập thành phố" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Địa chỉ</span>}
          name="address"
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item name="image" label={<span className="font-bold text-amber-800">Hình ảnh</span>}>
          {previewImage ? (
            <div className="flex flex-col items-start space-y-2">
              <Image src={previewImage} width={200} alt="Preview" />
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={handleRemoveImage}
              >
                Xoá ảnh
              </Button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-all ${
                dragOver ? "border-orange-500 bg-orange-50" : "border-gray-300"
              }`}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <UploadOutlined className="text-2xl text-orange-500 mb-2" />
              <p className="text-gray-500">Kéo & thả ảnh vào đây hoặc bấm để chọn từ máy</p>
            </div>
          )}
        </Form.Item>

        <div className="text-right">
          <Button onClick={onCancel} className="mr-2">Hủy</Button>
          <Button
            htmlType="submit"
            type="primary"
            loading={loading}
            className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
          >
            {isEdit ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default GalaxyAdminModal;
