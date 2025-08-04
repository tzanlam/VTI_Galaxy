import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Tag, Card, Spin } from "antd";
import { toast } from "react-toastify";
import bookingService from "../services/bookingService";
import moment from "moment";
import { fetchPaymentHistory } from "../redux/slices/paymentHistorySlice";

const PaymentHistory = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector(
    (state) => state.paymentHistory
  );
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const accountId = localStorage.getItem("accountId");
        if (!accountId || !isLoggedIn) {
          toast.error("Vui lòng đăng nhập");
          return;
        }

        // Test các endpoint có thể có
        console.log("Testing endpoints for accountId:", accountId);

        // Thử endpoint từ bookingService
        const response = await bookingService.fetchBookingsByAccountId(
          accountId
        );
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payment history:", error);

        // Tạm thời hiển thị empty state
        setPayments([]);
        toast.info("Chưa có lịch sử thanh toán");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [isLoggedIn]);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
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
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ghế",
      dataIndex: "seats",
      key: "seats",
      render: (seats) => seats?.join(", "),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },
    {
      title: "Phương thức",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => (
        <Tag color={method === "VNPAY" ? "blue" : "green"}>{method}</Tag>
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
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
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
