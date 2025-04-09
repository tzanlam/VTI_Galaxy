import axiosClient from "./axiosClient";

const seatRoomService = {
   fetchSeatRoom(){
      return axiosClient.get("/getSeatRoom")
   },
   fetchSeatRoomById(seatRoomId){
      return axiosClient.get(`/getSeatRoomById?seatRoomId=${seatRoomId}`)
   },
   createSeatRoom(seatRoomRequest){
      return axiosClient.post("/postSeatRoom", seatRoomRequest)
   },
   updateNameSeatRoom(seatRoomId, name){
      return axiosClient.put(`/putSeatRoomName?seatRoomId=${seatRoomId}&seatRoomName=${name}`)
   }
}
export default seatRoomService;