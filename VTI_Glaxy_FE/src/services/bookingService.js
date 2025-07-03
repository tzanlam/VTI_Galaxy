import axiosClient from "./axiosClient";

const bookingService = {
  fetchBookings() {
    return axiosClient.get("/getBookings");
  },
  fetchBookingById(bookingId) {
    return axiosClient.get(`/getBookingById?bookingId=${bookingId}`);
  },
  createBooking(bookingRequest) {
    return axiosClient.post("/postBooking", bookingRequest);
  },
  updateBooking(bookingId, bookingRequest) {
    return axiosClient.put(
      `/putBooking?bookingId=${bookingId}`,
      bookingRequest
    );
  },
  deleteBooking(bookingId) {
    return axiosClient.put(`/deleteBooking?bookingId=${bookingId}`);
  },
};

export default bookingService;
