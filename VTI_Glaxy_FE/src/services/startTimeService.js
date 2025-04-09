import axiosClient from "./axiosClient";

const startTimeService = {
   fetchStartTime(){
      return axiosClient.get("/getStartTimes")
   },
   createStartTime(startTime, endTime){
      return axiosClient.post(`/postStartTime?startTime=${startTime}&endTime=${endTime}`)
   }
}
export default startTimeService;