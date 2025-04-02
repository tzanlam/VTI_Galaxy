package demo.modal.entity;

import demo.modal.constant.OpenStatus;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String seatNameType;

    @Column
    private String description;

    @Column
    private int price;

    @Column
    @Enumerated(EnumType.STRING)
    private OpenStatus status;
}
