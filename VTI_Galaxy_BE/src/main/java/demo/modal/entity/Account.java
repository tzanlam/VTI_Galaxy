package demo.modal.entity;

import demo.modal.constant.ActiveStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Data
@Entity
@Table
@EqualsAndHashCode(callSuper=true)
public class Account extends Time{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String fullName;

    @Column
    private String phoneNumber;

    @Column
    private String avatar;

    @Column
    private String email;

    @Column
    private String password;

    @Column
    private LocalDate dateOfBirth;

    @Column
    @Enumerated(EnumType.STRING)
    private Position position;

    @Column
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column
    @Enumerated(EnumType.STRING)
    private ActiveStatus status;

    @Column
    private int point;

    @Column
    private String confirmCode;

    public enum Gender {
        MALE, FEMALE
    }

    public enum Position {
        ADMIN,
        MANAGER,
        USER
    }
}
