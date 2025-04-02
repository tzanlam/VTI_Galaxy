package demo.modal.request;

import demo.modal.constant.OpenStatus;
import demo.modal.entity.Galaxy;
import lombok.Data;

@Data
public class GalaxyRequest {
    private String name;
    private String address;

    public Galaxy addGalaxy(){
        Galaxy galaxy = new Galaxy();
        galaxy.setName(name);
        galaxy.setAddress(address);
        galaxy.setStatus(OpenStatus.CLOSED);
        return galaxy;
    }

    public void updateGalaxy(Galaxy galaxy){
        galaxy.setName(name);
        galaxy.setAddress(address);
        galaxy.setStatus(OpenStatus.CLOSED);
    }
}
