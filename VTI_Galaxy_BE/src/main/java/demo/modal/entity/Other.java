package demo.modal.entity;

import demo.modal.constant.ActiveStatus;
import demo.modal.constant.OtherStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@Table
@EqualsAndHashCode(callSuper=true)
public class Other extends Time{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name;

    @Column
    private String description;

    @Column
    private String image_url;
    @Column
    private int price;

    @Column
    private int quantity;

    @Column
    private OtherStatus otherStatus;

    @ManyToOne
    @JoinColumn
    private Galaxy galaxy;

    @Column
    @Enumerated(EnumType.STRING)
    private ActiveStatus status;


}
