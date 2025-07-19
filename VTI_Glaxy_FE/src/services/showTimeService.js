import axiosClient from "./axiosClient";

const showTimeService = {
  fetchShowTime() {
    return axiosClient.get("/getShowTimes");
  },
  fetchShowTimeById(showTimeId) {
    return axiosClient.get(`/getShowTime/${showTimeId}`);
  },
  fetchShowTimeByMovieDateAndRoom(roomId, movieId, date) {
    return axiosClient.get(
      `/getShowTimeByMovieDateAndRoom?movieId=${movieId}&date=${date}&roomId=${roomId}`
    );
  },
  fetchShowTimeByRoom(roomId) {
    return axiosClient.get(`getShowTimeByRoom?roomId=${roomId}`);
  },
  fetchShowTimeByMovieDateAndGalaxy(movieId, date, galaxyId) {
    return axiosClient.get(
      `/getShowTimeByMovieDateAndGalaxy?movieId=${movieId}&date=${date}&galaxyId=${galaxyId}`
    );
  },
  createShowTime(showTimeRequest) {
    return axiosClient.post("/postShowTime", showTimeRequest);
  },
  updateShowTime(showTimeId, showTimeRequest) {
    return axiosClient.put(`/putShowTime/${showTimeId}`, showTimeRequest);
  },
  deleteShowTime(showTimeId) {
    return axiosClient.delete(`/deleteShowTime/${showTimeId}`);
  },
};

export default showTimeService;
