import axiosClient from "./axiosClient";

const showTimeService = {
  fetchShowTime() {
    return axiosClient.get("/getShowTimes");
  },
  fetchShowTimeById(showTimeId) {
    return axiosClient.get(`/getShowTime/${showTimeId}`);
  },
  fetchShowTimeByMovieDateAndGalaxy(galaxyId, movieId, date) {
    return axiosClient.get("/getShowTimeByMovieDateAndGalaxy", {
      params: { galaxyId, movieId, date },
    });
  },
  fetchShowTimeByRoom(roomId){
    return axiosClient.get(`getShowTimeByRoom?roomId=${roomId}`)
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
