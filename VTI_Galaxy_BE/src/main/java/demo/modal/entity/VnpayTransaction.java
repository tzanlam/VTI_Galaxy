package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "vnpay_transaction")
@Data
public class VnpayTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vnp_transaction_id", nullable = false)
    private String vnpTransactionId;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "order_info")
    private String orderInfo;

    @Column(name = "transaction_status")
    private String transactionStatus;

    @Column(name = "created_at")
    private String createdAt;

    @OneToOne(mappedBy = "vnpayTransaction")
    private Booking booking;
}