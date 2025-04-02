package demo.modal.dto;

import demo.modal.entity.Galaxy;
import lombok.Data;

@Data
public class GalaxyDto {
    public int id;
    public String name;
    public String address;
    public String status;

    public GalaxyDto(Galaxy galaxy) {
        this.id = galaxy.getId();
        this.name = galaxy.getName();
        this.address = galaxy.getAddress();
        this.status = galaxy.getStatus() != null ? galaxy.getStatus().name() : null;
    }
}
