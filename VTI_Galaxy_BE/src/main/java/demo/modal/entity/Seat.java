package demo.modal.entity;

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
    private String name;

    @Column
    private int price;
}
