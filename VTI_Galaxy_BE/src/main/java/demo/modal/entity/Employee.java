package demo.modal.entity;

import demo.modal.constant.ActiveStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String fullName;

    @Column
    private String email;

    @Column
    private String phoneNumber;

    @Column
    private String address;

    @Column
    private LocalDate dateOfBirth;

    @Column
    private String jobTitle;

    @Column
    private String evaluate;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn
    private Galaxy galaxy;

    @Column
    private int numberOfWorkingHours;

    @Column
    private LocalDate startDateWorking;

    @Column
    private int salary;

    @Column
    @Enumerated(EnumType.STRING)
    private ActiveStatus status;
}
