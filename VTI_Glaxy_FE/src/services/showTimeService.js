import axiosClient from "./axiosClient";

const showTimeService = {
  fetchShowTime() {
    return axiosClient.get("/getShowTimes");
  },
  fetchShowTimeById(showTimeId) {
    return axiosClient.get(`/getShowTime/${showTimeId}`);
  },
  fetchShowTimesByFilter(galaxyId, movieId, date) {
    return axiosClient.get("/getShowTimesByFilter", {
      params: { galaxyId, movieId, date },
    });
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
