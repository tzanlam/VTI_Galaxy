package demo.modal.entity;

import demo.modal.constant.ActiveStatus;
import demo.modal.constant.AgeLimit;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table
@EqualsAndHashCode(callSuper=true)
public class Movie extends Time{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name;

    @Column
    private String country;

    @Column
    private String producer;

    @Column
    private String description;

    @Column
    private String director;

    @Column
    private String actor;

    @Column
    private String genre;

    @Column
    private LocalTime duration;

    @Column
    private LocalDate releaseDate;

    @Column
    private int rating;

    @Column
    @Enumerated(EnumType.STRING)
    private AgeLimit ageLimit;

    @Column
    @Enumerated(EnumType.STRING)
    private ActiveStatus status;
}
