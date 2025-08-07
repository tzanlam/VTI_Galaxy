package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class SeatRoom extends Time {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name; // vd a1, a2

    @ManyToOne
    @JoinColumn
    private Seat seat;

    @ManyToOne
    @JoinColumn
    private ShowTime showTime;

    @ManyToOne
    @JoinColumn
    private Room room;

    @Column
    @Enumerated(EnumType.STRING)
    private BookedStatus status;

    public enum BookedStatus {
        AVAILABLE,
        BOOKED,
        SELECTED
    }
}
