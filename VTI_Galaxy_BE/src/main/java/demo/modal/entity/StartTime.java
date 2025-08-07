package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table
public class StartTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn
    private ShowTime showTime;

    @Column
    private LocalTime time;

    @OneToMany(mappedBy = "startTime")
    private List<SeatRoom>  seatRooms = new ArrayList<>();
}