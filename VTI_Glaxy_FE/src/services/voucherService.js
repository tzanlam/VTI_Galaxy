import axiosClient from "./axiosClient";

const voucherService = {
  fetchVouchers: () => {
    return axiosClient.get("getVouchers");
  },
  fetchVoucherById: (voucherId) => {
    return axiosClient.get(`getVoucherById?voucherId=${voucherId}`);
  },
  createVoucher: (voucherRequest) => {
    return axiosClient.post("postVoucher", voucherRequest);
  },
  updateVoucher: (voucherId, voucherRequest) => {
    return axiosClient.put(`putVoucher?voucherId=${voucherId}`, voucherRequest);
  },
  deleteVoucher: (voucherId) => {
    return axiosClient.delete(`deleteVoucher?voucherId=${voucherId}`);
  },
  applyVoucher: ({ code, totalPrice }) => {
    return axiosClient.post("/api/voucher/apply", { code, totalPrice });
  },
};

export default voucherService;
