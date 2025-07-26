package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "vnpay_transaction")
@Data
public class VnpayTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "vnp_transaction_id", nullable = false) // Ánh xạ cột vnp_transaction_id
    private String vnpTransactionId; // Thêm trường này

    @Column(name = "txn_ref", nullable = false)
    private String txnRef;

    @Column(name = "amount", nullable = false)
    private long amount;

    @Column(name = "order_info")
    private String orderInfo;

    @Column(name = "response_code")
    private String responseCode;

    @Column(name = "transaction_status")
    private String transactionStatus;

    @Column(name = "bank_code")
    private String bankCode;

    @Column(name = "bank_tran_no")
    private String bankTranNo;

    @Column(name = "booking_id")
    private Integer bookingId;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Column(name = "update_date")
    private LocalDateTime updateDate;
}