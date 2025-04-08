import axiosClient from "./axiosClient"

const accountService = {
   fetchAccounts(){
      return axiosClient.get("/getAccounts")
   },
   fetchAccountById(accountId){
      return axiosClient.get(`/getAccountById?accountId=${accountId}`)
   },
   createAccountAdmin(accountRequest){
      return axiosClient.post("/registerAdmin", accountRequest)
   },
   createAccountUser(accountRequest){
      return axiosClient.post("/registerUser", accountRequest)
   },
   updateAccount(accountId, accountRequest){
      return axiosClient.put(`/putAccount?accountId=${accountId}`, accountRequest)
   },
   updateEmail(accountId, email){
      return axiosClient.put(`/putEmail?accountId=${accountId}&email=${email}`)
   },
   updatePassword(accountId, password){
      return axiosClient.put(`/putPassword?accountId=${accountId}&password=${password}`)
   },
   deleteAccount(accountId){
      return axiosClient.put(`/deleteAccount?accountId=${accountId}`)
   }
}

export default accountService