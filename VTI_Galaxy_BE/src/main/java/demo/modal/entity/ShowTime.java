package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
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

    @OneToMany(mappedBy = "showTime") // Sửa từ "showTimes" thành "showTime"
    private List<StartTime> startTimes;
}