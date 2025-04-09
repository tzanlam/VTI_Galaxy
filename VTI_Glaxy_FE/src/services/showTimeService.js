import axiosClient from "./axiosClient";

const showTimeService = {
   fetchShowTime(){
      return axiosClient.get("/getShowTimes")
   },
   fetchShowTimeByDateAndMovieandGalaxy(galaxyId, movieId, date){
      return axiosClient.get(`/getShowTimeByDateAndMovie?galaxyId=${galaxyId}&movieId=${movieId}&date=${date}`)
   },
   createShowTime(showTimeRequest){
      return axiosClient.post("/postShowTime", showTimeRequest)
   },
   updateShowTime(showTimeId, showTimeRequest){
      return axiosClient.put("/putShowTime?showTimeId="+showTimeId, showTimeRequest)
   }
}
export default showTimeService;