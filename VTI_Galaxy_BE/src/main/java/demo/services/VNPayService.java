package demo.services;

import demo.config.VNPay.VNPayConfig;
import demo.modal.entity.Booking;
import demo.modal.entity.VnpayTransaction;

import demo.repository.BookingRepository;
import demo.repository.VnpayTransactionRepository;
import demo.support.MethodSchedule;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VNPayService {
    private static final Logger log = LoggerFactory.getLogger(VNPayService.class);
    private final VnpayTransactionRepository vnpayTransactionRepository;
    private final VNPayConfig vnpayConfig;
    private final MethodSchedule  methodSchedule;
    private final BookingRepository bookingRepository;

    public String createOrder(int total, String orderInfo, String urlReturn, HttpServletRequest request) {
        String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
        String vnp_IpAddr = VNPayConfig.getIpAddress(request);
        String vnp_TmnCode = vnpayConfig.getVnpTmnCode();
        String orderType = "order-type";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(total * 100));
        vnp_Params.put("vnp_BankCode", "VNBANK");
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", urlReturn);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        vnp_Params.put("vnp_CreateDate", formatter.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        vnp_Params.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        String[] queryAndHash = buildQueryAndHashData(vnp_Params);
        String queryUrl = queryAndHash[0];
        String hashData = queryAndHash[1];

        String vnp_SecureHash = VNPayConfig.hmacSHA512(vnpayConfig.getVnpHashSecret(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        log.info("Create order w value {} - {} - {} - {}", total, orderInfo, urlReturn, request);
        return vnpayConfig.getVnpPayUrl() + "?" + queryUrl;
    }

    public Map<String, String> orderReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            fields.put(fieldName, fieldValue != null ? fieldValue : "");
            log.info("Parameter {}: {}", fieldName, fieldValue);
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (vnp_SecureHash == null) {
            log.error("vnp_SecureHash is missing in the request");
            Map<String, String> response = new HashMap<>();
            response.put("status", "missing_secure_hash");
            return response;
        }

        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        String signValue = VNPayConfig.hashAllFields(fields, vnpayConfig.getVnpHashSecret());
        log.info("Generated signValue: {}", signValue);
        log.info("Received vnp_SecureHash: {}", vnp_SecureHash);

        Map<String, String> response = new HashMap<>();
        response.put("txnRef", request.getParameter("vnp_TxnRef"));
        response.put("amount", request.getParameter("vnp_Amount"));
        String orderInfo = request.getParameter("vnp_OrderInfo");
        response.put("orderInfo", orderInfo);
        response.put("responseCode", request.getParameter("vnp_ResponseCode"));
        response.put("bankCode", request.getParameter("vnp_BankCode"));
        response.put("bankTranNo", request.getParameter("vnp_BankTranNo"));

        // Lấy bookingId từ orderInfo
        String bookingIdStr = orderInfo != null && orderInfo.contains("#") ? orderInfo.replaceAll("[^0-9]", "") : "";
        response.put("bookingId", bookingIdStr);

        // Xác định trạng thái
        String status;
        if (signValue.equals(vnp_SecureHash)) {
            status = "00".equals(request.getParameter("vnp_TransactionStatus")) ? "success" : "failed";
        } else {
            status = "invalid_signature";
        }
        response.put("status", status);

        // Lưu transaction
        saveTransaction(request, status);

        // === CỘNG ĐIỂM NẾU SUCCESS ===
        if ("success".equals(status) && !bookingIdStr.isEmpty()) {
            try {
                long bookingId = Long.parseLong(bookingIdStr);
                double paidAmount = Double.parseDouble(response.get("amount")) / 100; // VNPay trả *100
                methodSchedule.addPointAfterPayment((int) bookingId);
                log.info("Cộng điểm thành công cho bookingId {} với số tiền {}", bookingId, paidAmount);
            } catch (Exception e) {
                log.error("Lỗi khi cộng điểm cho booking {}: {}", bookingIdStr, e.getMessage());
            }
        }

        return response;
    }


    private void saveTransaction(HttpServletRequest request, String status) {
        VnpayTransaction transaction = new VnpayTransaction();
        transaction.setTxnRef(request.getParameter("vnp_TxnRef"));
        transaction.setVnpTransactionId(request.getParameter("vnp_TxnRef"));
        String amountStr = request.getParameter("vnp_Amount");
        if (amountStr != null && !amountStr.isEmpty()) {
            transaction.setAmount(Long.parseLong(amountStr));
        }
        String orderInfo = request.getParameter("vnp_OrderInfo");
        transaction.setOrderInfo(orderInfo);
        transaction.setResponseCode(request.getParameter("vnp_ResponseCode"));
        transaction.setTransactionStatus(status.toUpperCase());
        transaction.setBankCode(request.getParameter("vnp_BankCode"));
        transaction.setBankTranNo(request.getParameter("vnp_BankTranNo"));
        transaction.setCreateDate(LocalDateTime.now());
        transaction.setUpdateDate(LocalDateTime.now());

        if (orderInfo != null && orderInfo.contains("#")) {
            int bookingId = Integer.parseInt(orderInfo.replaceAll("[^0-9]", ""));
            if (bookingId != 0) {
                Booking booking = bookingRepository.findById(bookingId).orElseGet(
                        Booking::new);
                transaction.setBooking(booking);
            }
        }

        vnpayTransactionRepository.save(transaction);
    }

    private String[] buildQueryAndHashData(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        try {
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = params.get(fieldName);
                String encodedFieldName = URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString());
                String encodedFieldValue = URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString());

                hashData.append(encodedFieldName).append('=').append(encodedFieldValue);
                query.append(encodedFieldName).append('=').append(encodedFieldValue);

                if (itr.hasNext()) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Encoding error", e);
        }

        return new String[]{ query.toString(), hashData.toString() };
    }
}
