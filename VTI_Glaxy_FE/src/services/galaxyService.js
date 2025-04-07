import axiosClient from "./axiosClient";

const galaxyService = {
   fetchGalaxy(){
      return axiosClient.get("/getGalaxies")
   },
   fetchGalaxyById(galaxyId){
      return axiosClient.get(`/getGalaxyById?galaxyId=${galaxyId}`)
   },
   createGalaxy(galaxyRequest){
      return axiosClient.post("/postGalaxy", galaxyRequest)
   },
   updateGalaxy(galaxyId, galaxyRequest){
      return axiosClient.put(`/putGalaxy?galaxyId=${galaxyId}`, galaxyRequest)
   },
   deleteGalaxy(galaxyId){
      return axiosClient.put(`/putStatusGalaxy?galaxyId=${galaxyId}`)
   }
}

export default galaxyService;