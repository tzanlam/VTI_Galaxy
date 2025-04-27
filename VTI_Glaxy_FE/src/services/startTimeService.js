import axiosClient from "./axiosClient";

const startTimeService = {
  fetchStartTimes() {
    return axiosClient.get("/getStartTimes");
  },
  createStartTime(startTime, endTime) {
    return axiosClient.post("/postStartTime", { startTime, endTime });
  },
};

export default startTimeService;
