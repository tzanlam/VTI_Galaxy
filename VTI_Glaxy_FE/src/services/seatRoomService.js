import axiosClient from "./axiosClient";

const seatRoomService = {
  fetchSeatRooms() {
    return axiosClient.get("/getSeatRooms");
  },
  fetchSeatRoomById(seatRoomId) {
    return axiosClient.get(`/getSeatRoomById?seatRoomId=${seatRoomId}`);
  },
  fetchSeatRoomsByShowtimeId(showtimeId) {
    return axiosClient.get(`/getSeatRoomsByShowtime?showtimeId=${showtimeId}`);
  },
  fetchSeatRoomByTime(time, galaxyId, movieId){
    return axiosClient.get(`/getSeatRoomByTime/time/${time}/galaxyId/${galaxyId}/movieId/${movieId}`)
  },
  createSeatRoom(seatRoomRequest) {
    return axiosClient.post("/postSeatRoom", seatRoomRequest);
  },
  updateSeatRoomStatus(seatRoomId, status) {
    return axiosClient.put(
      `/putSeatRoomStatus?seatRoomId=${seatRoomId}&status=${status}`
    );
  },
  updateNameSeatRoom(seatRoomId, name) {
    return axiosClient.put(
      `/putNameSeatRoom?seatRoomId=${seatRoomId}&name=${name}`
    );
  },
};

export default seatRoomService;
