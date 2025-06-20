package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class SeatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn
    private Seat seat;

    @ManyToOne
    @JoinColumn
    private Room room;

    @ManyToOne
    @JoinColumn(name = "showtime_id")
    private ShowTime showTime;

    @Column
    @Enumerated(EnumType.STRING)
    private BookedStatus status;

    @Column
    private String seatPerRow;

    @Column
    private int quantityColumn;

    public enum BookedStatus {
        AVAILABLE,
        BOOKED,
        SELECTED
    }
}
