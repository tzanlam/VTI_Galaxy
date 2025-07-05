//package demo.services;
//
//import demo.config.VNPay.VNPayConfig;
//import demo.modal.entity.Booking;
//import demo.modal.entity.VnpayTransaction;
//import demo.repository.BookingRepository;
//import demo.repository.VnpayTransactionRepository;
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//import java.text.SimpleDateFormat;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//public class VNPayService {
//
//    @Autowired
//    private VnpayTransactionRepository vnpayTransactionRepository;
//
//    @Autowired
//    private BookingRepository bookingRepository;
//
//    public String createOrder(int total, String orderInfo, String urlReturn, String ipAddress, String vnpTxnRef) {
//        String vnp_Version = "2.1.0";
//        String vnp_Command = "pay";
//        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
//        String orderType = "order-type";
//
//        Map<String, String> vnp_Params = new TreeMap<>();
//        vnp_Params.put("vnp_Version", vnp_Version);
//        vnp_Params.put("vnp_Command", vnp_Command);
//        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
//        vnp_Params.put("vnp_Amount", String.valueOf(total * 100));
//        vnp_Params.put("vnp_CurrCode", "VND");
//        vnp_Params.put("vnp_TxnRef", vnpTxnRef);
//        vnp_Params.put("vnp_OrderInfo", orderInfo);
//        vnp_Params.put("vnp_OrderType", orderType);
//        vnp_Params.put("vnp_Locale", "vn");
//        vnp_Params.put("vnp_ReturnUrl", urlReturn);
//        vnp_Params.put("vnp_IpAddr", ipAddress);
//
//        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
//        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
//        String vnp_CreateDate = formatter.format(cld.getTime());
//        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
//
//        cld.add(Calendar.MINUTE, 15);
//        String vnp_ExpireDate = formatter.format(cld.getTime());
//        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
//
//        StringBuilder hashData = new StringBuilder();
//        StringBuilder query = new StringBuilder();
//        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
//        Collections.sort(fieldNames);
//        for (String fieldName : fieldNames) {
//            String fieldValue = vnp_Params.get(fieldName);
//            if (fieldValue != null && !fieldValue.isEmpty()) {
//                try {
//                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));
//                    query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString()))
//                            .append('=')
//                            .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));
//                } catch (Exception e) {
//                    throw new RuntimeException("Error encoding parameter: " + fieldName, e);
//                }
//                if (fieldNames.indexOf(fieldName) < fieldNames.size() - 1) {
//                    query.append('&');
//                    hashData.append('&');
//                }
//            }
//        }
//
//        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
//        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
//        return VNPayConfig.vnp_PayUrl + "?" + query.toString();
//    }
//
//    public Map<String, String> orderReturn(HttpServletRequest request) {
//        Map<String, String> response = new HashMap<>();
//        Map<String, String> fields = new TreeMap<>();
//        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
//            String fieldName = params.nextElement();
//            String fieldValue = request.getParameter(fieldName);
//            if (fieldValue != null && !fieldValue.isEmpty()) {
//                fields.put(fieldName, fieldValue);
//            }
//        }
//
//        String vnp_SecureHash = fields.remove("vnp_SecureHash");
//        String hashData = fields.entrySet().stream()
//                .map(entry -> {
//                    try {
//                        return entry.getKey() + "=" + URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString());
//                    } catch (Exception e) {
//                        throw new RuntimeException("Error encoding field: " + entry.getKey(), e);
//                    }
//                })
//                .collect(Collectors.joining("&"));
//        String computedHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData);
//
//        if (!computedHash.equals(vnp_SecureHash)) {
//            response.put("status", "error");
//            response.put("message", "Invalid checksum");
//            return response;
//        }
//
//        String vnp_TransactionStatus = fields.get("vnp_TransactionStatus");
//        String vnp_TxnRef = fields.get("vnp_TxnRef");
//        String vnp_Amount = fields.get("vnp_Amount");
//        String vnp_OrderInfo = fields.get("vnp_OrderInfo");
//
//        // Sửa lỗi: Gọi orElseThrow trên Optional<Booking>
//        Booking booking = bookingRepository.findByVnpTxnRef(vnp_TxnRef)
//                .orElseThrow(() -> new IllegalArgumentException("Booking not found with vnp_TxnRef: " + vnp_TxnRef));
//
//        long expectedAmount = booking.getTotalPrice() * 100;
//        if (Long.parseLong(vnp_Amount) != expectedAmount) {
//            response.put("status", "error");
//            response.put("message", "Invalid amount: expected " + expectedAmount + ", got " + vnp_Amount);
//            return response;
//        }
//
//        VnpayTransaction transaction = new VnpayTransaction();
//        transaction.setVnpTransactionId(vnp_TxnRef);
//        transaction.setAmount(Long.parseLong(vnp_Amount) / 100);
//        transaction.setOrderInfo(vnp_OrderInfo);
//        transaction.setTransactionStatus(vnp_TransactionStatus);
//        transaction.setCreatedAt(fields.get("vnp_CreateDate"));
//        transaction.setBooking(booking);
//
//        vnpayTransactionRepository.save(transaction);
//
//        String statusMessage;
//        switch (vnp_TransactionStatus) {
//            case "00":
//                statusMessage = "Transaction successful";
//                response.put("status", "success");
//                response.put("bookingId", String.valueOf(booking.getId()));
//                break;
//            case "01":
//                statusMessage = "Transaction not completed";
//                response.put("status", "error");
//                response.put("message", statusMessage);
//                break;
//            case "02":
//                statusMessage = "Transaction failed";
//                response.put("status", "error");
//                response.put("message", statusMessage);
//                break;
//            case "04":
//                statusMessage = "Transaction reversed";
//                response.put("status", "error");
//                response.put("message", statusMessage);
//                break;
//            default:
//                statusMessage = "Unknown transaction status: " + vnp_TransactionStatus;
//                response.put("status", "error");
//                response.put("message",statusMessage);
//        }
//
//        return response;
//    }
//}