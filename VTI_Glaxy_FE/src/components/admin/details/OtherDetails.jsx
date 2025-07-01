import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, Typography } from 'antd';
import { FiInfo, FiArrowLeft, FiEdit } from 'react-icons/fi';
import { fetchOtherById } from '../../../redux/slices/otherSlice';
import OtherAdminModal from '../model/OtherModal';

const { Title, Text } = Typography;

const OtherDetails = () => {
  const { otherId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { other, loading } = useSelector(state => state.other || {});
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    if (otherId) {
      dispatch(fetchOtherById(otherId));
    }
  }, [otherId, dispatch]);

  if (loading) return <Spin />;

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-xl bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 shadow-lg">
      <div className="flex items-center space-x-3">
        <FiInfo className="text-amber-700 text-3xl" />
        <Title level={3} className="!text-amber-800">Thông tin Combo</Title>
      </div>

      <div className="text-amber-900 space-y-2 mt-4">
        <Text strong>ID:</Text> <span>{other?.id}</span><br />
        <Text strong>Tên:</Text> <span>{other?.name}</span><br />
        <Text strong>Mô tả:</Text> <span>{other?.description}</span><br />
        <Text strong>Giá:</Text> <span>{other?.price} VND</span><br />
        <Text strong>Số lượng:</Text> <span>{other?.quantity}</span><br />
        <Text strong>Trạng thái:</Text> <span>{other?.status}</span><br />
        <Text strong>Galaxy:</Text> <span>{other?.galaxyId}</span><br />
        <Text strong>Hình ảnh:</Text> <a href={other?.image_url} target="_blank" rel="noreferrer">Xem ảnh</a>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <Button
          icon={<FiArrowLeft />}
          onClick={() => navigate('/management/other')}
          className="bg-gray-300 hover:bg-gray-400 rounded-full font-bold flex items-center justify-center space-x-2"
        >
          Quay lại
        </Button>
        <Button
          icon={<FiEdit />}
          onClick={() => setIsEditModalVisible(true)}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white flex items-center justify-center space-x-2"
        >
          Chỉnh sửa
        </Button>
      </div>

      <OtherAdminModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        isEdit={true}
        initialValues={other}
        onSubmit={(values) => {
          // Gửi update tại đây nếu cần
          console.log('Update:', values);
          setIsEditModalVisible(false);
        }}
        loading={false}
        galaxies={[]} // fetch list nếu cần
      />
    </div>
  );
};

export default OtherDetails;
