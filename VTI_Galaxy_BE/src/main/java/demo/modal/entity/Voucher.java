package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Entity
@Table
@Data
public class Voucher extends Time {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String voucherName;

    @Column
    private int discount;

    @Column
    private LocalDateTime start_date;

    @Column
    private LocalDateTime end_date;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
}
