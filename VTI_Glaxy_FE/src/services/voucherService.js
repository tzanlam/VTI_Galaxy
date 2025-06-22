import axiosClient from "./axiosClient";

const voucherService = {
  fetchVouchers: () => {
    return axiosClient.get("/api/voucher");
  },
  fetchVoucherById: (voucherId) => {
    return axiosClient.get(`/api/voucher/${voucherId}`);
  },
  createVoucher: (voucherRequest) => {
    return axiosClient.post("/api/voucher", voucherRequest);
  },
  updateVoucher: (voucherId, voucherRequest) => {
    return axiosClient.put(`/api/voucher/${voucherId}`, voucherRequest);
  },
  deleteVoucher: (voucherId) => {
    return axiosClient.delete(`/api/voucher/${voucherId}`);
  },
  applyVoucher: ({ code, totalPrice }) => {
    return axiosClient.post("/api/voucher/apply", { code, totalPrice });
  },
};

export default voucherService;
