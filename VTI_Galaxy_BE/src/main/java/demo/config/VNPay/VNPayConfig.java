package demo.config.VNPay;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
@Getter
public class VNPayConfig {
    @Value("${vnp.payUrl}")
    private String vnpPayUrl;

    @Value("${vnp.returnUrl}")
    private String vnpReturnUrl;

    @Value("${vnp.tmnCode}")
    private String vnpTmnCode;

    @Value("${vnp.hashSecret}")
    private String vnpHashSecret;

    @Value("${vnp.apiUrl}")
    private String vnpApiUrl;

    public static String hmacSHA512(final String key, final String data) {
        if (key == null || data == null) {
            throw new IllegalArgumentException("Key or data must not be null");
        }
        try {
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes(StandardCharsets.UTF_8);
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC-SHA512", e);
        }
    }

    public static String hashAllFields(Map<String, String> fields, String hashSecret) {
        if (fields == null) {
            throw new IllegalArgumentException("Fields must not be null");
        }
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = fields.get(fieldName);
            // Bao gồm cả tham số rỗng để khớp với VNPay
            try {
                String encodedValue = fieldValue != null ? URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()) : "";
                sb.append(fieldName).append("=").append(encodedValue);
                if (i < fieldNames.size() - 1) {
                    sb.append("&");
                }
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException("Encoding error", e);
            }
        }
        String hashData = sb.toString();

        return hmacSHA512(hashSecret, hashData);
    }

    public static String getIpAddress(HttpServletRequest request) {
        if (request == null) {
            return "127.0.0.1"; // Fallback cho trường hợp request null
        }
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }

    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}