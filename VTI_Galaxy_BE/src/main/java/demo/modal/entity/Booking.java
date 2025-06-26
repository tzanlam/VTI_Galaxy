package demo.modal.entity;

import demo.modal.constant.BookingStatus;
import demo.modal.constant.PaymentMethod;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

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
    private List<Other> Other; // Danh sách combo

    @Column(nullable = false)
    private long totalPrice; // Tổng tiền

    @ManyToOne
    @JoinColumn(name = "galaxy_id", nullable = false)
    private Galaxy galaxy; // Rạp chiếu

    @ManyToOne
    @JoinColumn(name = "voucher_id", nullable = true)
    private Voucher voucher;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod; // Phương thức thanh toán

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus status; // Trạng thái đặt vé (PENDING, CONFIRMED, CANCELLED)

    @OneToOne(cascade = CascadeType.ALL) // Mối quan hệ @OneToOne với VnpayTransaction nên có chiến lược cascade để quản lý vòng đời (ví dụ: xóa giao dịch khi xóa đặt vé).
    @JoinColumn(name = "vnpay_transaction_id")
    private VnpayTransaction vnpayTransaction;
}
