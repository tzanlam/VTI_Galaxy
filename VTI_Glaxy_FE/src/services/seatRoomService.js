import axiosClient from "./axiosClient";

const seatRoomService = {
  fetchSeatRoomById(seatRoomId) {
    return axiosClient.get(`/getSeatRoomById?seatRoomId=${seatRoomId}`);
  },
  fetchSeatRoomByRoomId(roomId) {
    return axiosClient.get(`/getSeatRoomsByRoomId?roomId=${roomId}`);
  },
};

export default seatRoomService;
