package demo.controller;

import demo.modal.constant.BookingStatus;
import demo.modal.request.BookingRequest;
import demo.services.VNPayService;
import demo.services.interfaceClass.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/vnpay-payment")
public class VNPayController {

    @Autowired
    private VNPayService vnpayService;

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<Map<String, String>> handleVNPayReturn(HttpServletRequest request) {
        Map<String, String> response = vnpayService.orderReturn(request);
        if ("success".equals(response.get("status"))) {
            // Cập nhật trạng thái đặt vé thành CONFIRMED
            String bookingId = response.get("bookingId");
            BookingRequest bookingRequest = new BookingRequest();
            bookingRequest.setStatus(BookingStatus.CONFIRMED);
            bookingService.updateBooking(Integer.parseInt(bookingId), bookingRequest);
        }
        return ResponseEntity.ok(response);
    }
}