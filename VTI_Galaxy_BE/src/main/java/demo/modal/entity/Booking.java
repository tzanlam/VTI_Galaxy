package demo.modal.entity;

import demo.modal.constant.BookingStatus;
import demo.modal.constant.PaymentMethod;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table
@Data
@EqualsAndHashCode(callSuper = true)
public class Booking extends Time {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToMany
    @JoinTable(
            name = "booking_seat_rooms",
            joinColumns = @JoinColumn(name = "booking_id"),
            inverseJoinColumns = @JoinColumn(name = "seat_room_id")
    )
    private List<SeatRoom> seatRooms = new ArrayList<>();

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Other> others = new ArrayList<>();

    @Column(nullable = false)
    private int totalPrice;

    @ManyToOne(optional = false)
    private Galaxy galaxy;

    @ManyToOne(optional = false)
    private Account account;

    @ManyToOne(optional = false)
    private ShowTime showTime;

    @ManyToOne
    private Voucher voucher;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @OneToOne(mappedBy = "booking")
    private VnpayTransaction vnpayTransaction;

    @Column
    private String vnpTxnRef;
}
