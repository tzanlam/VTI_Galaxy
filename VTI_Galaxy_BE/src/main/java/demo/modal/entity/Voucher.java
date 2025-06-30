package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table
@Data
@EqualsAndHashCode(callSuper = true)
public class Voucher extends Time {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name;

    @Column
    private int discount;

    @Column
    private LocalDateTime startDate;

    @Column
    private LocalDateTime endDate;

    @OneToMany(mappedBy = "voucher")
    private List<Booking> bookings;
}
