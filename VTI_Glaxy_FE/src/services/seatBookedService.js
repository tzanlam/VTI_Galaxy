import axiosClient from "./axiosClient"

const seatBookedService = {
    fetchSeatBooked(roomId, time){
        return axiosClient.get(`/roomId/${roomId}/time/${time}`)
    }
}
export default seatBookedService