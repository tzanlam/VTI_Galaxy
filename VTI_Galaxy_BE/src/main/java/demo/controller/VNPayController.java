package demo.controller;

import demo.modal.constant.BookingStatus;
import demo.modal.request.BookingRequest;
import demo.modal.request.VnPayRequest;
import demo.services.VNPayService;
import demo.services.interfaceClass.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/vnpay-payment")
@RequiredArgsConstructor
public class VNPayController {
    private final VNPayService vnpayService;
    private final BookingService bookingService;

    @GetMapping("/get")
    public ResponseEntity<Map<String, String>> handleVNPayReturn(HttpServletRequest request) {
        Map<String, String> response = vnpayService.orderReturn(request);

        if ("success".equals(response.get("status"))) {
            String orderInfo = response.get("orderInfo");
            String bookingId = orderInfo != null ? orderInfo.replaceAll("[^0-9]", "") : "";
            if (!bookingId.isEmpty()) {
                BookingRequest bookingRequest = new BookingRequest();
                bookingRequest.setStatus(BookingStatus.CONFIRMED);
                bookingService.updateBooking(Integer.parseInt(bookingId), bookingRequest);
            }
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createVnPay(@RequestBody VnPayRequest request, HttpServletRequest http){
        String paymentUrl = vnpayService.createOrder(Math.toIntExact(request.getTotal()), request.getOrderId(), request.getReturnUrl(), http);
        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(response);
    }
}