package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "vnpay_transactions")
@Data
public class VnpayTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String txnRef; // Mã giao dịch VNPay (vnp_TxnRef)

    @Column(nullable = false)
    private Long amount; // Số tiền (VND * 100)

    @Column
    private String orderInfo; // Thông tin đơn hàng

    @Column
    private String responseCode; // Mã phản hồi từ VNPay

    @Column
    private String transactionStatus; // Trạng thái giao dịch (PENDING, SUCCESS, FAILED)

    @Column
    private String bankCode; // Mã ngân hàng

    @Column
    private String bankTranNo; // Mã giao dịch ngân hàng

    @Column
    private LocalDateTime createDate; // Thời gian tạo

    @Column
    private LocalDateTime updateDate; // Thời gian cập nhật

    @OneToOne(mappedBy = "vnpayTransaction")
    private Booking booking; // Liên kết với đặt vé
}
