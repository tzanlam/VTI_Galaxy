import React, { useState } from 'react';
import { Modal, Form, Input, Button, DatePicker, TimePicker, Upload, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateMovieModal = ({ visible, onCancel, onSubmit, loading, onUploadFile }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [trailerFile, setTrailerFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTrailer, setPreviewTrailer] = useState('');

  const handleUploadChange = (info, setFile, setPreview) => {
    if (info.file.status !== 'removed') {
      const file = info.file.originFileObj;
      setFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (values) => {
    try {
      let imageURL = values.imageURL;
      let trailerURL = values.trailerURL;

      // Upload files nếu có
      if (imageFile) {
        const uploadedImageURL = await onUploadFile(imageFile);
        imageURL = uploadedImageURL;
      }
      if (trailerFile) {
        const uploadedTrailerURL = await onUploadFile(trailerFile);
        trailerURL = uploadedTrailerURL;
      }

      // Chuẩn hoá data
      const payload = {
        ...values,
        releaseDate: values.releaseDate.format('YYYY-MM-DD'),
        duration: values.duration.format('HH:mm'),
        imageURL,
        trailerURL,
      };
      await onSubmit(payload);
      form.resetFields();
      setImageFile(null);
      setTrailerFile(null);
      setPreviewImage('');
      setPreviewTrailer('');
    } catch (error) {
      message.error('Lỗi khi tạo phim!', error);
    }
  };
  
  return (
    <Modal
      title={<span className="font-bold text-amber-800">Tạo Phim Mới</span>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      className="rounded-xl"
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label={<span className="font-bold text-amber-800">Tên phim</span>}
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}
        >
          <Input placeholder="Nhập tên phim" />
        </Form.Item>

        <Form.Item label={<span className="font-bold text-amber-800">Mô tả</span>} name="description">
          <Input.TextArea rows={3} placeholder="Nhập mô tả phim" />
        </Form.Item>

        <Form.Item label={<span className="font-bold text-amber-800">Thể loại</span>} name="genre">
          <Input placeholder="Nhập thể loại" />
        </Form.Item>

        <Form.Item label={<span className="font-bold text-amber-800">Diễn viên</span>} name="actor">
          <Input placeholder="Nhập diễn viên" />
        </Form.Item>

        <Form.Item label={<span className="font-bold text-amber-800">Đạo diễn</span>} name="director">
          <Input placeholder="Nhập đạo diễn" />
        </Form.Item>

        <Form.Item label={<span className="font-bold text-amber-800">Thời lượng</span>} name="duration">
          <TimePicker format="HH:mm" placeholder="Chọn giờ:phút" />
        </Form.Item>

        <Form.Item label={<span className="font-bold text-amber-800">Ngày phát hành</span>} name="releaseDate">
          <DatePicker format="YYYY-MM-DD" placeholder="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label={<span className="font-bold text-amber-800">Ảnh</span>}>
          <Upload
            beforeUpload={() => false}
            onChange={(info) => handleUploadChange(info, setImageFile, setPreviewImage)}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          {previewImage && <img src={previewImage} alt="preview" style={{ marginTop: 10, maxHeight: 200 }} />}
        </Form.Item>

        <Form.Item label={<span className="font-bold text-amber-800">Trailer</span>}>
          <Upload
            beforeUpload={() => false}
            onChange={(info) => handleUploadChange(info, setTrailerFile, setPreviewTrailer)}
            maxCount={1}
            accept="video/*"
          >
            <Button icon={<UploadOutlined />}>Chọn video trailer</Button>
          </Upload>
          {previewTrailer && (
            <video controls style={{ marginTop: 10, maxHeight: 200 }}>
              <source src={previewTrailer} />
            </video>
          )}
        </Form.Item>

        <Form.Item label={<span className="font-bold text-amber-800">Quốc gia</span>} name="country">
          <Input placeholder="Nhập quốc gia" />
        </Form.Item>

        <Form.Item label={<span className="font-bold text-amber-800">Nhà sản xuất</span>} name="producer">
          <Input placeholder="Nhập nhà sản xuất" />
        </Form.Item>

        <Form.Item
          label={<span className="font-bold text-amber-800">Đánh giá</span>}
          name="rating"
          rules={[
            { required: true, message: 'Vui lòng nhập số đánh giá' },
            { pattern: /^\d+$/, message: 'Vui lòng nhập số' },
          ]}
        >
          <Input placeholder="Nhập số đánh giá" />
        </Form.Item>

        <Form.Item label={<span className="font-bold text-amber-800">Giới hạn độ tuổi</span>} name="ageLimit">
          <Select placeholder="Chọn giới hạn độ tuổi">
            {['T12','T13','T14','T15','T16','T18'].map(value => (
              <Option key={value} value={value}>{value}</Option>
            ))}
          </Select>
        </Form.Item>

        <div className="text-right mt-4">
          <Button onClick={onCancel} className="mr-2">Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
          >
            Tạo
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateMovieModal;
