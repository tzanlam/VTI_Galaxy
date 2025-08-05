import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Tag, Card, Spin, Empty } from "antd";
import { toast } from "react-toastify";
import moment from "moment";
import { fetchPaymentHistory } from "../redux/slices/paymentHistorySlice";

const PaymentHistory = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector(
    (state) => state.paymentHistory
  );
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const accountId = localStorage.getItem("accountId");
    if (accountId && isLoggedIn) {
      dispatch(fetchPaymentHistory(accountId));
    } else {
      toast.error("Vui lòng đăng nhập để xem lịch sử thanh toán");
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "accountName",
      key: "accountName",
      render: (text, record) => record.account?.username || "Không xác định",
    },
    {
      title: "Email",
      dataIndex: "accountEmail",
      key: "accountEmail",
      render: (text, record) => record.account?.email || "Không xác định",
    },
    {
      title: "Phim",
      dataIndex: "movieName",
      key: "movieName",
    },
    {
      title: "Rạp",
      dataIndex: "galaxyName",
      key: "galaxyName",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "showDate",
      key: "showDate",
      render: (date) =>
        date ? moment(date).format("DD/MM/YYYY HH:mm") : "Không xác định",
    },
    {
      title: "Ghế",
      dataIndex: "seats",
      key: "seats",
      render: (seats) => (seats?.length ? seats.join(", ") : "Không xác định"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) =>
        price
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(price)
          : "0 ₫",
    },
    {
      title: "Phương thức",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => (
        <Tag color={method === "VNPAY" ? "blue" : "green"}>
          {method || "Không xác định"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "COMPLETED"
              ? "green"
              : status === "PENDING"
              ? "orange"
              : "red"
          }
        >
          {status === "COMPLETED"
            ? "Thành công"
            : status === "PENDING"
            ? "Đang xử lý"
            : "Thất bại"}
        </Tag>
      ),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? moment(date).format("DD/MM/YYYY HH:mm") : "Không xác định",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty description="Vui lòng đăng nhập để xem lịch sử thanh toán" />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card title="Lịch sử thanh toán" className="shadow-md">
          <Empty description="Không có lịch sử thanh toán" />
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card title="Lịch sử thanh toán" className="shadow-md">
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default PaymentHistory;
