package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class SeatRoom{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name;

    @ManyToOne
    @JoinColumn
    private Seat seat;

    @ManyToOne
    @JoinColumn
    private Room room;

    @ManyToOne
    @JoinColumn(name = "show_time_id")
    private ShowTime showTime;
}
