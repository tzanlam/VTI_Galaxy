import axiosClient from "./axiosClient"

const roomService = {
   fetchRooms(){
      return axiosClient.get("/getRooms")
   },
   fetchRoomById(roomId){
      return axiosClient.get(`/getRoomById?roomId=${roomId}`)
   },
   fetchRoomByGalaxy(galaxyId){
      return axiosClient.get(`/getRoomByGalaxy?galaxyId=${galaxyId}`)
   },
   createRoom(roomRequest){
      return axiosClient.post("/postRoom", roomRequest)
   },
   updateRoom(roomId, roomRequest){
      return axiosClient.put(`/putRoom?roomId=${roomId}`, roomRequest)
   },
   deleteRoom(roomId){
      return axiosClient.put(`/deleteRoom?roomId=${roomId}`)
   }
}
export default roomService