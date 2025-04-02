package demo.modal.entity;

import demo.modal.constant.OpenStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Data
@Table
@EqualsAndHashCode(callSuper=true)
public class Galaxy extends Time{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name;

    @Column
    private String address;

    @Column
    @Enumerated(EnumType.STRING)
    private OpenStatus status;

    @OneToMany(mappedBy = "galaxy")
    private List<Room> rooms;
}
