import axiosClient from "./axiosClient";

const seatService = {
  fetchSeats() {
    return axiosClient.get("/getSeat");
  },
  fetchSeatById(seatId) {
    return axiosClient.get(`/getSeatById?seatId=${seatId}`);
  },
  fetchSeatByRoomId(roomId) {
    return axiosClient.get(`/getSeatByRoomId?roomId=${roomId}`);
  },
  fetchSeatByShowTimeId(showTimeId) {
    return axiosClient.get(`/getSeatByShowTimeId?showTimeId=${showTimeId}`);
  },
  createSeat(seatRequest) {
    return axiosClient.post("/postSeat", seatRequest);
  },
  updateSeat(seatId, seatRequest) {
    return axiosClient.put(`/putSeat?seatId=${seatId}`, seatRequest);
  },
  deleteSeat(seatId) {
    return axiosClient.put(`putStatusSeat?seatId=${seatId}`);
  },
};
export default seatService;
