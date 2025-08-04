package demo.controller;

import demo.modal.constant.BookingStatus;
import demo.modal.request.BookingRequest;
import demo.modal.request.VnPayRequest;
import demo.services.VNPayService;
import demo.services.interfaceClass.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/vnpay-payment")
@RequiredArgsConstructor
public class VNPayController {
    private static final Logger log = LoggerFactory.getLogger(VNPayController.class);
    private final VNPayService vnpayService;
    private final BookingService bookingService;

    @GetMapping("/get")
    public ResponseEntity<String> handleVNPayReturn(HttpServletRequest request) {
        Map<String, String> response = vnpayService.orderReturn(request);

        if ("success".equals(response.get("status"))) {
            String orderInfo = response.get("orderInfo");
            String bookingId = orderInfo != null ? orderInfo.replaceAll("[^0-9]", "") : "";
            log.info("Extracted bookingId from orderInfo '{}': {}", orderInfo, bookingId);

            if (!bookingId.isEmpty()) {
                try {
                    BookingRequest bookingRequest = new BookingRequest();
                    bookingRequest.setStatus(BookingStatus.CONFIRMED);
                    bookingService.updateBooking(Integer.parseInt(bookingId), bookingRequest);
                    log.info("Updated booking status to CONFIRMED for bookingId: {}", bookingId);
                } catch (Exception e) {
                    log.error("Failed to update booking status for bookingId {}: {}", bookingId, e.getMessage());
                }
            } else {
                log.warn("No bookingId extracted from orderInfo: {}", orderInfo);
            }

            // Định dạng thời gian thanh toán
            String paymentTime = response.get("vnp_PayDate") != null ? response.get("vnp_PayDate") : "Không có";
            if (paymentTime != "Không có") {
                try {
                    String year = paymentTime.substring(0, 4);
                    String month = paymentTime.substring(4, 6);
                    String day = paymentTime.substring(6, 8);
                    String hour = paymentTime.substring(8, 10);
                    String minute = paymentTime.substring(10, 12);
                    String second = paymentTime.substring(12, 14);
                    paymentTime = String.format("%s/%s/%s %s:%s:%s", day, month, year, hour, minute, second);
                } catch (Exception e) {
                    log.error("Error formatting paymentTime: {}", paymentTime, e);
                    paymentTime = "Không có";
                }
            }


            String totalPrice = response.get("amount") != null ? String.format("%,d VND", Long.parseLong(response.get("amount")) / 100) : "0 VND";

            String htmlResponse = String.format(
                    "<!DOCTYPE html>" +
                            "<html>" +
                            "<head>" +
                            "<meta charset='UTF-8'>" +
                            "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                            "<title>Thanh toán thành công</title>" +
                            "<style>" +
                            "body { background-color: #f5f5f5; font-family: Arial, sans-serif; }" +
                            ".container { max-width: 600px; margin: 50px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }" +
                            ".header { text-align: center; color: #0052cc; margin-bottom: 20px; }" +
                            ".success-icon { font-size: 50px; color: #28a745; text-align: center; margin-bottom: 20px; }" +
                            ".table { width: 100%%; border-collapse: collapse; }" +
                            ".table th, .table td { padding: 10px; border: 1px solid #dee2e6; }" +
                            ".table th { width: 40%%; background-color: #e9ecef; font-weight: bold; }" +
                            ".btn { display: inline-block; padding: 10px 20px; background-color: #0052cc; color: #ffffff; text-decoration: none; border-radius: 5px; text-align: center; }" +
                            ".btn:hover { background-color: #003087; }" +
                            ".footer { text-align: center; margin-top: 20px; color: #6c757d; }" +
                            "</style>" +
                            "</head>" +
                            "<body>" +
                            "<div class='container'>" +
                            "<div class='success-icon'>✔</div>" +
                            "<h1 class='header'>Thanh toán thành công</h1>" +
                            "<p style='text-align: center;'>Giao dịch của bạn đã được xử lý thành công qua cổng thanh toán VNPay.</p>" +
                            "<h2 style='margin: 20px 0 10px;'>Chi tiết giao dịch</h2>" +
                            "<table class='table'>" +
                            "<tr><th>Thông tin đơn hàng</th><td>%s</td></tr>" +
                            "<tr><th>Mã đặt vé</th><td>%s</td></tr>" +
                            "<tr><th>Tổng tiền</th><td>%s</td></tr>" +
                            "<tr><th>Thời gian thanh toán</th><td>%s</td></tr>" +
                            "<tr><th>Mã giao dịch</th><td>%s</td></tr>" +
                            "</table>" +
                            "<div style='text-align: center; margin-top: 20px;'>" +
                            "<a href='http://localhost:5173/' class='btn'>Về trang chủ</a>" +
                            "</div>" +
                            "<div class='footer'>" +
                            "<p>Được xử lý bởi <strong>VNPay</strong> - Cổng thanh toán an toàn và tiện lợi</p>" +
                            "</div>" +
                            "</div>" +
                            "</body>" +
                            "</html>",
                    orderInfo != null ? orderInfo : "Không có",
                    bookingId.isEmpty() ? "Không có" : bookingId,
                    totalPrice,
                    paymentTime,
                    response.get("txnRef") != null ? response.get("txnRef") : "Không có"
            );
            return ResponseEntity.ok().header("Content-Type", "text/html").body(htmlResponse);
        } else {
            log.error("Transaction failed with status: {}", response.get("status"));
            String htmlError = String.format(
                    "<!DOCTYPE html>" +
                            "<html>" +
                            "<head>" +
                            "<meta charset='UTF-8'>" +
                            "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                            "<title>Thanh toán thất bại</title>" +
                            "<style>" +
                            "body { background-color: #f5f5f5; font-family: Arial, sans-serif; }" +
                            ".container { max-width: 600px; margin: 50px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }" +
                            ".header { text-align: center; color: #dc3545; margin-bottom: 20px; }" +
                            ".btn { display: inline-block; padding: 10px 20px; background-color: #0052cc; color: #ffffff; text-decoration: none; border-radius: 5px; text-align: center; }" +
                            ".btn:hover { background-color: #003087; }" +
                            "</style>" +
                            "</head>" +
                            "<body>" +
                            "<div class='container'>" +
                            "<h1 class='header'>Thanh toán thất bại</h1>" +
                            "<p style='text-align: center;'>Lỗi: %s</p>" +
                            "<div style='text-align: center; margin-top: 20px;'>" +
                            "<a href='http://localhost:5173/' class='btn'>Về trang chủ</a>" +
                            "</div>" +
                            "</div>" +
                            "</body>" +
                            "</html>",
                    response.get("status")
            );
            return ResponseEntity.status(400).header("Content-Type", "text/html").body(htmlError);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createVnPay(@RequestBody VnPayRequest request, HttpServletRequest http){
        String paymentUrl = vnpayService.createOrder(Math.toIntExact(request.getTotal()), request.getOrderId(), request.getReturnUrl(), http);
        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(response);
    }
}