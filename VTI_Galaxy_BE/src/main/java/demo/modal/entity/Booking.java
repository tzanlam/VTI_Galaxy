package demo.modal.entity;

import demo.modal.constant.BookingStatus;
import demo.modal.constant.PaymentMethod;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table
@Data
public class Booking extends Time{
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
    private List<Other> Other;

    @Column(nullable = false)
    private int totalPrice;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Galaxy galaxy;

    @ManyToOne
    @JoinColumn( nullable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(nullable = false)
    private ShowTime showTime;

    @ManyToOne
    @JoinColumn
    private Voucher voucher;

    @Column
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn
    private VnpayTransaction vnpayTransaction;

    @Column
    private String vnpTxnRef;
}
