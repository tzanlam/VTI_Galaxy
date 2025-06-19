import axiosClient from "./axiosClient";

const seatRoomService = {
  fetchSeatRooms() {
    return axiosClient.get("/getSeatRoom");
  },
  fetchSeatRoomById(seatRoomId) {
    return axiosClient.get(`/getSeatRoomById?seatRoomId=${seatRoomId}`);
  },
  fetchSeatRoomsByRoomId(roomId) {
    return axiosClient.get(`/getSeatRoomsByRoomId?roomId=${roomId}`);
  },
  fetchSeatRoomsByShowtimeId(showtimeId) {
    return axiosClient.get(
      `/getSeatRoomsByShowtimeId?showtimeId=${showtimeId}`
    );
  },
  createSeatRoom(seatRoomRequest) {
    return axiosClient.post("/postSeatRoom", seatRoomRequest);
  },
  updateSeatRoomStatus(seatRoomId, status) {
    return axiosClient.put(
      `/updateSeatRoomStatus?seatRoomId=${seatRoomId}&status=${status}`
    );
  },
  updateNameSeatRoom(seatRoomId, name) {
    return axiosClient.put(
      `/putSeatRoomName?seatRoomId=${seatRoomId}&seatRoomName=${name}`
    );
  },
};
export default seatRoomService;
