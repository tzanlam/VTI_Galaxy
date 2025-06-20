import axiosClient from "./axiosClient";

const seatService = {
  fetchSeats() {
    return axiosClient.get("/getSeats");
  },
  fetchSeatById(seatId) {
    return axiosClient.get(`/getSeatById?seatId=${seatId}`);
  },
  fetchSeatByShowTimeId(showTimeId) {
    return axiosClient.get(`/getSeatRoomsByShowtime?showtimeId=${showTimeId}`);
  },
  createSeat(seatRequest) {
    return axiosClient.post("/postSeat", seatRequest);
  },
  updateSeat(seatId, seatRequest) {
    return axiosClient.put(`/putSeat?seatId=${seatId}`, seatRequest);
  },
  deleteSeat(seatId) {
    return axiosClient.put(`/putStatusSeat?seatId=${seatId}`);
  },
};

export default seatService;
