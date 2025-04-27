import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStartTimes, createStartTime } from "./slices/startTimeSlice";

const StartTime = () => {
  const dispatch = useDispatch();
  const { startTimes, loading, error } = useSelector(
    (state) => state.startTime
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    dispatch(fetchStartTimes());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      alert("Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc");
      return;
    }
    dispatch(createStartTime({ startTime, endTime }));
    setStartTime("");
    setEndTime("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Thời Gian Bắt Đầu</h2>

      {/* Form thêm thời gian mới */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Thêm Thời Gian Mới</h3>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thời gian bắt đầu (HH:mm)
            </label>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="10:00"
              className="mt-1 p-2 border border-gray-300 rounded-md w-32"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thời gian kết thúc (HH:mm)
            </label>
            <input
              type="text"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="12:00"
              className="mt-1 p-2 border border-gray-300 rounded-md w-32"
            />
          </div>
          <button
            type="submit"
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Thêm
          </button>
        </form>
      </div>

      {/* Danh sách thời gian bắt đầu */}
      {loading && <p className="text-gray-500">Đang tải...</p>}
      {error && (
        <p className="text-red-500">
          Lỗi: {error.message || "Không thể tải danh sách"}
        </p>
      )}
      {!loading && !error && startTimes.length > 0 ? (
        <div className="grid gap-4">
          {startTimes.map((st) => (
            <div key={st.id} className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm font-medium">
                ID: {st.id} | Bắt đầu: {st.startTime} | Kết thúc: {st.endTime}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="text-gray-500">Không có thời gian bắt đầu nào.</p>
        )
      )}
    </div>
  );
};

export default StartTime;
