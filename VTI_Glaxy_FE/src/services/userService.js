import api from "./axiosClient.js";

const userService = {
    getAll() {
        return api.get("/findAccount"); // Lấy danh sách tài khoản
    },
    create(body) {
        return api.post("/createAccountByAdmin", body); // Tạo tài khoản bởi admin
    },
    update(body, id) {
        return api.put(`/updateAccount?accountId=${id}`, body); // Cập nhật tài khoản
    },
    delete(id) { // Sửa lỗi cú pháp
        return api.delete(`/user/delete/${id}`); // Xóa tài khoản
    },
};

export default userService;