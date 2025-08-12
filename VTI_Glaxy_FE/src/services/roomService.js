import axiosClient from "./axiosClient";

const roomService = {
  fetchRooms() {
    return axiosClient.get("/getRooms");
  },
  fetchRoomById(roomId) {
    return axiosClient.get(`/getRoomById?roomId=${roomId}`);
  },
  fetchRoomByGalaxy(galaxyId) {
    return axiosClient.get(`/getRoomByGalaxy?galaxyId=${galaxyId}`);
  },
  fetchRoomByShowTime(movieId, galaxyId, time){
    return axiosClient.get(`/getRoomByShowTime?movieId=${movieId}&galaxyId=${galaxyId}&time=${time}`)
  },
  createRoom(roomRequest) {
    return axiosClient.post("/postRoom", roomRequest);
  },
  updateRoom(roomId, roomRequest) {
    return axiosClient.put(`/putRoom?roomId=${roomId}`, roomRequest);
  },
  deleteRoom(roomId) {
    return axiosClient.delete(`/deleteRoom?roomId=${roomId}`);
  },
};
export default roomService;
