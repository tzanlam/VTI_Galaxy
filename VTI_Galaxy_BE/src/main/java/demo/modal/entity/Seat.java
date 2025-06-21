package demo.modal.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import demo.modal.constant.OpenStatus;
import demo.modal.constant.SeatType;
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
    private String name; // Tên ghế, ví dụ: "A1", "A2"

    @Column
    @Enumerated(EnumType.STRING)
    private SeatType type; // Loại ghế: STANDARD, VIP, COUPLE

    @Column
    private String description;

    @Column
    private int price;

    @Column
    @Enumerated(EnumType.STRING)
    private OpenStatus status;

    @ManyToOne
    @JoinColumn(name = "room_id")
    @JsonBackReference
    private Room room;



}
