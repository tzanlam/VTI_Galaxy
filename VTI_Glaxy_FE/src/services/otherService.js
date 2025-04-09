import axiosClient from "./axiosClient"

const otherService = {
   fetchOthers(){
      return axiosClient.get("/getOthers")
   },
   fetchOtherById(otherId){
      return axiosClient.get(`/getOtherById?otherId=${otherId}`)
   },
   fetchOtherByGalaxyId(galaxyId){
      return axiosClient.get(`/getOtherByGalaxyId?galaxyId=${galaxyId}`)
   },
   createOther(otherRequest){
      return axiosClient.post("/postOther", otherRequest)
   },
   updateOther(otherId, otherRequest){
      return axiosClient.put(`/putOther?otherId=${otherId}`, otherRequest)
   },
   deleteOther(otherId){
      return axiosClient.put(`/deleteOther?otherId=${otherId}`)
   }
}
export default otherService