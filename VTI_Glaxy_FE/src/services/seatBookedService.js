import axiosClient from "./axiosClient";

const seatBookedService = {
  fetchSeatBooked(roomId, time, date) {
    return axiosClient.get(
      `/getSeatBooked?roomId=${roomId}&time=${time}&date=${date}`
    );
  },
};
export default seatBookedService;
