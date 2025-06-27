package demo.modal.entity;

import demo.modal.constant.ActiveStatus;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private Galaxy galaxy;

    @Column
    @Enumerated(EnumType.STRING)
    private ActiveStatus status;

    @ManyToOne
    @JoinColumn
    private Booking booking;
}