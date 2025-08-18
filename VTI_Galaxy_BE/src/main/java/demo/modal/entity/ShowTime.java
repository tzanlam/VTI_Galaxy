package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"movie_id", "galaxy_id", "room_id", "date"})
})
@Data
public class ShowTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn
    private Galaxy galaxy;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Movie movie;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Room room;

    @Column
    private LocalDate date;

    @OneToMany(mappedBy = "showTime", fetch = FetchType.EAGER)
    private List<StartTime> startTimes = new ArrayList<>();

    @OneToMany(mappedBy = "showTime")
    private List<SeatRoom> seatRoom;
}