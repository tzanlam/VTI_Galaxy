package demo.modal.dto;

import demo.modal.entity.Other;
import lombok.Data;

@Data
public class OtherDto {
    private int id;
    private String name;
    private String description;
    private String image_url;
    private int price;
    private int quantity;
    private int galaxyId;
    private String status;

    public OtherDto(Other other){
        this.id = other.getId();
        this.name = other.getName();
        this.description = other.getDescription();
        this.image_url = other.getImage_url();
        this.price = other.getPrice();
        this.quantity = other.getQuantity();
        this.status = other.getStatus() != null ? other.getStatus().toString() : null;
        this.galaxyId = other.getGalaxy().getId();
    }
}
