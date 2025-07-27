import axiosClient from "./axiosClient";

const paymentService = {
  get() {
    return axiosClient.get("/vnpay-payment/get");
  },
  create(requetst) {
    return axiosClient.post("/vnpay-payment/create", requetst);
  },
};

export default paymentService;
