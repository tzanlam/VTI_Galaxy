import axiosClient from "./axiosClient"

const employeeService = {
   fetchEmployees(){
      return axiosClient.get("/getEmployees")
   },
   fetchEmployeeById(employeeId){
      return axiosClient.get(`/getEmployeeById?employeeId=${employeeId}`)
   },
   fetchEmployeeByGalaxyId(galaxyId){
      return axiosClient.get(`/getEmployeeByGalaxyId?galaxyId=${galaxyId}`)
   },
   createEmployee(employeeRequest){
      return axiosClient.post("/postEmployee", employeeRequest)
   },
   updateEmployee(employeeId, employeeRequest){
      return axiosClient.put(`/putEmployee?employeeId=${employeeId}`, employeeRequest)
   },
   deleteEmployee(employeeId){
      return axiosClient.put(`/deleteEmployee?employeeId=${employeeId}`)
   }
}

export default employeeService