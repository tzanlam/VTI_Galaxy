package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;


@Entity
@Table
@Data
@EqualsAndHashCode(callSuper = true)
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
    @JoinColumn
    private Booking booking;
}
