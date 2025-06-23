import React, { useEffect } from 'react';
import { Button, Spin, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { FiInfo } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGalaxyById } from '../../../redux/slices/galaxySlice';

const { Text, Title } = Typography;

const GalaxyDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { galaxy, loading } = useSelector((state) => state.galaxy || {});

  useEffect(() => {
    dispatch(fetchGalaxyById(id));
  }, [id, dispatch]);

  if (loading) return <Spin />;

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-xl bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 shadow-lg">
      <div className="flex items-center space-x-3">
        <FiInfo className="text-amber-700 text-3xl" />
        <h2 className="text-2xl font-bold text-amber-800">Galaxy {galaxy?.name}</h2>
      </div>
      <div className="text-amber-900 space-y-2 mt-3">
        <div><span className="font-semibold">ID:</span> {galaxy?.id}</div>
        <div><span className="font-semibold">Tên:</span> {galaxy?.name}</div>
        <div><span className="font-semibold">Địa chỉ:</span> {galaxy?.address}</div>
        <div><span className="font-semibold">Trạng thái:</span> {galaxy?.status}</div>
        <div><span className="font-semibold">Thành phố:</span> {galaxy?.city}</div>
        <div><span className="font-semibold">Ngày tạo:</span> {galaxy?.created}</div>
      </div>

      <div className="text-center mt-6">
        <Button
          onClick={() => navigate(-1)}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white flex items-center justify-center space-x-2"
        >
          Quay lại
        </Button>
      </div>
    </div>
  );
};

export default GalaxyDetails;
