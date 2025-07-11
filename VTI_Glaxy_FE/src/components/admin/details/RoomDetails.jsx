import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Spin,
  Typography,
  Divider,
  DatePicker,
  Image,
  Tooltip,
} from "antd";
import {
  FiInfo,
  FiCalendar,
  FiArrowLeft,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import { fetchRoomById } from "../../../redux/slices/roomSlice";
import { fetchMovies } from "../../../redux/slices/movieSlice"; // nếu có
import ShowTimeAdminModal from "../model/ShowTimeAdminModal";
import { fetchShowTimeByRoomAndDate } from "../../../redux/slices/showTimeSlice";

const { Title } = Typography;

const RoomDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const room = useSelector((state) => state.room.room);
  const { showTimes = [], loading } = useSelector((state) => state.showTime);
  const movies = useSelector((state) => state.movie?.movies || []);

  const movieMap = useMemo(() => {
    const map = {};
    movies.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  }, [movies]);

  const [date, setDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTimesVisible, setShowTimesVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchRoomById(roomId));
    dispatch(fetchMovies()); // nếu không có thì bỏ
  }, [dispatch, roomId]);

  const handleFetchShowTime = async (selectedDate) => {
    const formatted = selectedDate.format("YYYY-MM-DD");
    await dispatch(
      fetchShowTimeByRoomAndDate({
        roomId,
        date: formatted,
      })
    );
    setShowTimesVisible(true);
  };

  const handleChangeDate = (newDate) => {
    setDate(newDate);
    handleFetchShowTime(newDate);
  };

  const handlePrevDate = () => {
    const prev = date.subtract(1, "day");
    setDate(prev);
    handleFetchShowTime(prev);
  };

  const handleNextDate = () => {
    const next = date.add(1, "day");
    setDate(next);
    handleFetchShowTime(next);
  };

  console.log("log của showtimes", showTimes);

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-xl bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FiInfo className="text-amber-700 text-3xl" />
          <h2 className="text-2xl font-bold text-amber-800">
            Phòng {room?.name}
          </h2>
        </div>
        <Button
          icon={<FiArrowLeft />}
          onClick={() => navigate(-1)}
          className="border-none bg-white text-amber-600 hover:bg-gray-100"
        >
          Quay lại
        </Button>
      </div>

      <div className="text-amber-900 space-y-1 mb-6">
        <div>
          <b>ID:</b> {room?.id}
        </div>
        <div>
          <b>Tên:</b> {room?.name}
        </div>
        <div>
          <b>Loại màn hình:</b> {room?.typeScreen}
        </div>
        <div>
          <b>Trạng thái:</b> {room?.status}
        </div>
        <div>
          <b>Sức chứa:</b> {room?.capacity}
        </div>
        <div>
          <b>Rạp:</b> {room?.galaxyName}
        </div>
      </div>

      <div className="text-center mt-4 space-x-4">
        <Button
          icon={<FiCalendar />}
          type="primary"
          onClick={() => {
            const today = dayjs();
            setDate(today);
            handleFetchShowTime(today);
          }}
          className="bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-white"
        >
          Xem lịch chiếu
        </Button>
        {showTimesVisible && (
          <Button
            icon={<FiPlus />}
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 rounded-full text-white font-bold"
          >
            Thêm suất chiếu
          </Button>
        )}
      </div>

      {showTimesVisible && (
        <>
          <Divider />
          <div className="flex items-center justify-between bg-yellow-100 border border-amber-600 rounded-md px-4 py-2 shadow-inner mb-4">
            <div className="flex items-center gap-2 text-amber-800 font-semibold">
              <FiCalendar />
              <span>{date?.format("YYYY-MM-DD")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip title="Ngày trước">
                <Button
                  icon={<FiChevronLeft />}
                  onClick={handlePrevDate}
                  className="border border-amber-500 text-amber-700 hover:bg-yellow-200"
                />
              </Tooltip>
              <DatePicker
                value={date}
                onChange={handleChangeDate}
                format="YYYY-MM-DD"
                className="border border-amber-500 text-amber-700 hover:border-amber-600"
              />
              <Tooltip title="Ngày sau">
                <Button
                  icon={<FiChevronRight />}
                  onClick={handleNextDate}
                  className="border border-amber-500 text-amber-700 hover:bg-yellow-200"
                />
              </Tooltip>
            </div>
          </div>
        </>
      )}

      {showTimesVisible && (
        <>
          {loading && <Spin className="block mx-auto mt-4" />}
          {!loading && (
            <div className="space-y-4">
              {showTimes.length === 0 ? (
                <p className="text-center text-amber-700">
                  Không có lịch chiếu
                </p>
              ) : (
                showTimes.map((show) => (
                  <div
                    key={show.id}
                    className="p-4 bg-yellow-100 border border-yellow-300 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-lg transition duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        width={100}
                        className="rounded-md shadow-md border border-yellow-400"
                        src={movieMap[show.movieId]?.imageURL}
                        alt={movieMap[show.movieId]?.name}
                        fallback="https://via.placeholder.com/100x140?text=No+Image"
                      />
                      <div className="text-amber-800 font-bold text-lg">
                        {movieMap[show.movieId]?.name ||
                          `Phim ID: ${show.movieId}`}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {show.startTimes?.length > 0 ? (
                        show.startTimes.map((time, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-1 bg-yellow-300 text-amber-800 font-semibold rounded-full border border-yellow-400 shadow-sm hover:bg-yellow-400 transition"
                          >
                            {time}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">
                          Chưa có giờ chiếu
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      <ShowTimeAdminModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        roomId={roomId}
        galaxyId={room?.galaxyId}
      />
    </div>
  );
};

export default RoomDetails;
