import axiosClient from "./axiosClient";

const supportService = {
   confirm(accountId, code){
      return axiosClient.post(`/confirm?accountId=${accountId}&code=${code}`)
   },
   postImage(file){
      return axiosClient.post("/postImg", file, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      })
   }
}
export default supportService;