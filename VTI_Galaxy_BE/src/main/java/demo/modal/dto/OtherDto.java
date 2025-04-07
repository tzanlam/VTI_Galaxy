package demo.modal.dto;

import demo.modal.entity.Other;
import lombok.Data;

@Data
public class OtherDto {
    private int id;
    private String type;
    private String name;
    private int price;
    private int quantity;
    private String status;

    public OtherDto(Other other){
        this.id = other.getId();
        this.type = other.getType();
        this.name = other.getName();
        this.price = other.getPrice();
        this.quantity = other.getQuantity();
        this.status = other.getStatus() != null ? other.getStatus().toString() : null;
    }
}
