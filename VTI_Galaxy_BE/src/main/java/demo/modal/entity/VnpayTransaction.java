package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table
@Data
public class VnpayTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String vnpTransactionId;

    @Column(nullable = false)
    private String txnRef;

    @Column(nullable = false)
    private long amount;

    @Column
    private String orderInfo;

    @Column
    private String responseCode;

    @Column
    private String transactionStatus;

    @Column
    private String bankCode;

    @Column
    private String bankTranNo;

    @OneToOne
    @JoinColumn(nullable = false)
    private Booking booking;

    @Column
    private LocalDateTime createDate;

    @Column
    private LocalDateTime updateDate;
}
