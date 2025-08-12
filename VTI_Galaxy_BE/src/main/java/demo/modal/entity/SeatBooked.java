package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table
public class SeatBooked {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn
    private SeatRoom seatRoom;

    @ManyToOne
    @JoinColumn
    private ShowTime showTime;

    @Column
    @Enumerated(EnumType.STRING)
    private SeatRoomStatus status;

    public enum SeatRoomStatus {
        AVAILABLE, BOOKED
    }
}
