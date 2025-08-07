package demo.modal.entity;

import demo.modal.constant.OpenStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import net.minidev.json.annotate.JsonIgnore;

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
    private  String image;

    @Column
    private String city;

    @Column
    @Enumerated(EnumType.STRING)
    private OpenStatus status;

    @OneToMany(mappedBy = "galaxy")
    @JsonIgnore
    private List<Room> rooms;

    @OneToMany(mappedBy = "galaxy")
    @JsonIgnore
    private List<Other> others;
}
