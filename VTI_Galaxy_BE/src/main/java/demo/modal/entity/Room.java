package demo.modal.entity;

import demo.modal.constant.OpenStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Table
@Data
@EqualsAndHashCode(callSuper=true)
public class Room extends Time{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name;

    @Column
    private String typeScreen;

    @Column
    @Enumerated(EnumType.STRING)
    private OpenStatus status;

    @Column
    private int capacity;

    @ManyToOne
    @JoinColumn
    private Galaxy galaxy;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private List<Seat> seats; // Danh sách ghế trong phòng
}
