package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table
@Data
public class ShowTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn
    private Galaxy galaxy;

    @ManyToOne
    @JoinColumn
    private Movie movie;

    @Column
    private LocalDate date;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "showtime_start_times", joinColumns = @JoinColumn(name = "showtime_id"))
    @Column(name = "start_time")
    private List<LocalTime> startTimes = new ArrayList<>();
}