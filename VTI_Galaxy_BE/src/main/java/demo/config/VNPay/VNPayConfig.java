package demo.config.VNPay;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Component
public class VNPayConfig {
    public static String vnp_PayUrl = "http://sandbox.vnpayment.vn/tryitnow/Home/CreateOrder";
    public static String vnp_Returnurl = "http://localhost:8082/vnpay-payment"; // Use ngrok for external testing
    public static String vnp_TmnCode = "YOUR_SANDBOX_TMN_CODE"; // Replace with actual VNPay sandbox TmnCode
    public static String vnp_HashSecret = "YOUR_SANDBOX_HASH_SECRET"; // Replace with actual VNPay sandbox HashSecret
    public static String vnp_apiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

    public static String md5(String message) {
        String digest = null;
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(message.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                sb.append(String.format("%02x", b & 0xff));
            }
            digest = sb.toString();
        } catch (UnsupportedEncodingException | NoSuchAlgorithmException ex) {
            System.err.println("MD5 error: " + ex.getMessage());
            throw new RuntimeException("Failed to compute MD5 hash", ex);
        }
        return digest;
    }

    public static String Sha256(String message) {
        String digest = null;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(message.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                sb.append(String.format("%02x", b & 0xff));
            }
            digest = sb.toString();
        } catch (UnsupportedEncodingException | NoSuchAlgorithmException ex) {
            System.err.println("SHA-256 error: " + ex.getMessage());
            throw new RuntimeException("Failed to compute SHA-256 hash", ex);
        }
        return digest;
    }

    public static String hashAllFields(Map fields) {
        List fieldNames = new ArrayList(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append("=");
                try {
                    sb.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));
                } catch (UnsupportedEncodingException e) {
                    System.err.println("Encoding error for field " + fieldName + ": " + e.getMessage());
                    throw new RuntimeException("Failed to encode field: " + fieldName, e);
                }
                if (itr.hasNext()) {
                    sb.append("&");
                }
            }
        }
        return hmacSHA512(vnp_HashSecret, sb.toString());
    }

    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                System.err.println("Null key or data in hmacSHA512");
                throw new NullPointerException("Key or data cannot be null");
            }
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
        } catch (Exception ex) {
            System.err.println("hmacSHA512 error: " + ex.getMessage());
            throw new RuntimeException("Failed to compute HMAC SHA512", ex);
        }
    }

    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress;
        try {
            if (request == null) {
                System.err.println("HttpServletRequest is null, using default IP: 127.0.0.1");
                return "127.0.0.1";
            }
            ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null || ipAddress.isEmpty()) {
                ipAddress = request.getRemoteAddr();
            }
            if (ipAddress == null || ipAddress.isEmpty()) {
                System.err.println("Unable to determine IP address, using default: 127.0.0.1");
                ipAddress = "127.0.0.1";
            }
        } catch (Exception e) {
            System.err.println("Error getting IP address: " + e.getMessage());
            ipAddress = "127.0.0.1";
        }
        System.out.println("Resolved IP address: " + ipAddress);
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