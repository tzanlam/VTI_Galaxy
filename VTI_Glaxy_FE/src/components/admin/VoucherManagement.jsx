// components/voucher/VoucherManagement.jsx
import React, { useEffect, useState } from 'react';
import { Button, Card, Tag } from 'antd';
import { FiPlusCircle, FiGift } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVouchers, createVoucher, updateVoucher } from '../../redux/slices/voucherSlice';
import { useNavigate } from 'react-router-dom';
import VoucherModal from './model/VoucherAdminModal';

const VoucherManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vouchers = [] } = useSelector((state) => state.voucher || {});
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(fetchVouchers());
  }, [dispatch]);

  const handleOpenModal = (data = null) => {
    setEditData(data);
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    if (editData) {
      await dispatch(updateVoucher({ voucherId: editData.id, voucherRequest: values }));
    } else {
      await dispatch(createVoucher(values));
    }
    setModalVisible(false);
    setEditData(null);
    dispatch(fetchVouchers());
  };

  const getTagColor = (discount) => {
    if (discount >= 50) return 'volcano';
    if (discount >= 30) return 'orange';
    return 'green';
  };

  return (
    <div style={{ padding: 24 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-amber-700">Danh sách Voucher</h2>
        <Button
          icon={<FiPlusCircle />}
          type="primary"
          onClick={() => handleOpenModal()}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
        >
          Tạo voucher mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.map((voucher) => (
          <div
            key={voucher.id}
            onClick={() => navigate(`/management/voucher/${voucher.id}`)}
            className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 shadow-md cursor-pointer relative overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 90% 100%, 10% 100%, 0 85%)' }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <FiGift className="text-xl text-amber-600" />
              <span className="text-lg font-bold text-amber-800">{voucher.name}</span>
            </div>
            <Tag color={getTagColor(voucher.discount)}>Giảm {voucher.discount}%</Tag>
            <div className="mt-2 text-sm text-gray-700">
              <div>Bắt đầu: {voucher.startDate}</div>
              <div>Kết thúc: {voucher.endDate}</div>
            </div>
            <Button
              size="small"
              type="link"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal(voucher);
              }}
            >
              Sửa
            </Button>
          </div>
        ))}
      </div>

      <VoucherModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editData}
        isEdit={!!editData}
      />
    </div>
  );
};

export default VoucherManagement;
