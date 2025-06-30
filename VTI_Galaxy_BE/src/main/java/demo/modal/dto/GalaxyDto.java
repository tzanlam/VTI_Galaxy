package demo.modal.dto;

import demo.modal.entity.Galaxy;
import lombok.Data;

@Data
public class GalaxyDto {
    private int id;
    private String name;
    private String address;
    private String image;
    private String status;
    private String city;
    private String created;

    public GalaxyDto(Galaxy galaxy) {
        this.id = galaxy.getId();
        this.name = galaxy.getName();
        this.address = galaxy.getAddress();
        this.image = galaxy.getImage() != null ? galaxy.getImage() : "" ;
        this.status = galaxy.getStatus() != null ? galaxy.getStatus().name() : null;
        this.city = galaxy.getCity();
        this.created = galaxy.getCreated() != null ? galaxy.getCreated().toString() : null;
    }
}
