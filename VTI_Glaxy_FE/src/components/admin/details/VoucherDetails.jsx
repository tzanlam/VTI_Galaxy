import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, Typography } from 'antd';
import { FiInfo, FiArrowLeft, FiEdit } from 'react-icons/fi';
import dayjs from 'dayjs';
import { fetchVoucherById } from '../../../redux/slices/voucherSlice';
import VoucherModal from '../model/VoucherAdminModal';

const { Title, Text } = Typography;

const VoucherDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { voucherId } = useParams();
  const { voucher, loading } = useSelector((state) => state.voucher || {});

  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);

  useEffect(() => {
    if (voucherId) {
      dispatch(fetchVoucherById(voucherId));
    }
  }, [voucherId, dispatch]);

  if (loading) return <Spin />;

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-xl bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 shadow-lg">
      <div className="flex items-center space-x-3">
        <FiInfo className="text-amber-700 text-3xl" />
        <Title level={3} className="!text-amber-800">
          Thông tin Voucher
        </Title>
      </div>

      <div className="text-amber-900 space-y-2 mt-4">
        <Text strong>ID:</Text> <span>{voucher?.id}</span>
        <br />
        <Text strong>Tên voucher:</Text> <span>{voucher?.name}</span>
        <br />
        <Text strong>Phần trăm giảm:</Text> <span>{voucher?.discount}%</span>
        <br />
        <Text strong>Thời gian bắt đầu:</Text> <span>{dayjs(voucher?.startDate).format('DD/MM/YYYY HH:mm')}</span>
        <br />
        <Text strong>Thời gian kết thúc:</Text> <span>{dayjs(voucher?.endDate).format('DD/MM/YYYY HH:mm')}</span>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <Button
          icon={<FiArrowLeft />}
          onClick={() => navigate('/management/voucher')}
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

      <VoucherModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        isEdit={true} 
        onSubmit={() => setIsEditModalVisible(false)} // tuỳ thay đổi khi có logic update
        initialValues={voucher}
        loading={false}
      />
    </div>
  );
};

export default VoucherDetails;
