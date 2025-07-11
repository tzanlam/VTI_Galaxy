import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, Button, Tag, DatePicker, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGalaxies
} from "../../../redux/slices/galaxySlice";
import { fetchMovies } from "../../../redux/slices/movieSlice";
import { postShowTime } from "../../../redux/slices/showTimeSlice";
import { fetchRoomByGalaxy } from "../../../redux/slices/roomSlice";

const ShowTimeAdminModal = ({ visible, onCancel, roomId }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [startTimes, setStartTimes] = useState([]);
  const [startTimeInput, setStartTimeInput] = useState("");
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);

  const { galaxies = [] } = useSelector((state) => state.galaxy || {});
  const { rooms = [] } = useSelector((state) => state.galaxy || {});
  const { movies = [] } = useSelector((state) => state.movie || {});

  useEffect(() => {
    dispatch(fetchGalaxies());
    dispatch(fetchMovies());
  }, [dispatch]);

  useEffect(() => {
    if (selectedGalaxy) {
      dispatch(fetchRoomByGalaxy(selectedGalaxy));
    }
  }, [selectedGalaxy, dispatch]);

  const handleAddTime = () => {
    if (startTimeInput && !startTimes.includes(startTimeInput)) {
      setStartTimes([...startTimes, startTimeInput]);
      setStartTimeInput("");
    }
  };

  const handleRemoveTime = (time) => {
    setStartTimes(startTimes.filter((t) => t !== time));
  };

  const handleSubmit = async (values) => {
    const payload = {
      galaxyId: values.galaxyId,
      roomId: values.roomId,
      movieId: values.movieId,
      date: values.date.format("YYYY-MM-DD"),
      startTimes,
    };
    await dispatch(postShowTime(payload));
    form.resetFields();
    setStartTimes([]);
    onCancel();
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold text-amber-700">Thêm suất chiếu mới</span>}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Chọn Galaxy"
          name="galaxyId"
          rules={[{ required: true, message: "Vui lòng chọn galaxy" }]}
        >
          <Select
            placeholder="Chọn rạp"
            onChange={(val) => setSelectedGalaxy(val)}
            options={galaxies.map((g) => ({ label: g.name, value: g.id }))}
          />
        </Form.Item>

        <Form.Item
          label="Chọn Phòng"
          name="roomId"
          initialValue={roomId || undefined}
          rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
        >
          <Select
            placeholder="Chọn phòng"
            options={rooms.map((r) => ({ label: r.name, value: r.id }))}
            disabled={!selectedGalaxy && !roomId}
          />
        </Form.Item>

        <Form.Item
          label="Chọn Phim"
          name="movieId"
          rules={[{ required: true, message: "Vui lòng chọn phim" }]}
        >
          <Select
            placeholder="Chọn phim"
            optionLabelProp="label"
            dropdownRender={(menu) => <div className="max-h-60 overflow-auto">{menu}</div>}
          >
            {movies.map((movie) => (
              <Select.Option key={movie.id} value={movie.id} label={movie.title}>
                <div className="flex items-center space-x-2">
                  <img
                    src={movie.imageURL || "https://via.placeholder.com/40"}
                    alt=""
                    className="w-10 h-10 object-cover rounded"
                  />
                  <span>{movie.name}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Ngày chiếu"
          name="date"
          rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Giờ chiếu">
          <div className="flex space-x-2 mb-2">
            <Input
              value={startTimeInput}
              onChange={(e) => setStartTimeInput(e.target.value)}
              placeholder="Ví dụ: 13:30"
            />
            <Button onClick={handleAddTime} type="primary" className="bg-amber-600">Thêm</Button>
          </div>
          <div className="space-x-2">
            {startTimes.map((time) => (
              <Tag
                key={time}
                closable
                onClose={() => handleRemoveTime(time)}
                className="bg-amber-100 text-amber-800 border border-amber-300"
              >
                {time}
              </Tag>
            ))}
          </div>
        </Form.Item>

        <Form.Item className="text-right mt-4">
          <Button onClick={onCancel} className="mr-2">Hủy</Button>
          <Button type="primary" htmlType="submit" className="bg-green-600 text-white">Lưu</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ShowTimeAdminModal;