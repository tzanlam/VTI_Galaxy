package demo.modal.request;

import lombok.Data;

@Data
public class VnPayRequest {
    private Long  total;
    private String orderId;
    private String returnUrl;
}
