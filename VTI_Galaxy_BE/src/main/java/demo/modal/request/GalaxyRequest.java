package demo.modal.request;

import demo.modal.constant.OpenStatus;
import demo.modal.entity.Galaxy;
import lombok.Data;

@Data
public class GalaxyRequest {
    private String name;
    private String address;
    private String city;
    private String image;

    public Galaxy addGalaxy(){
        Galaxy galaxy = new Galaxy();
        galaxy.setName(name);
        galaxy.setAddress(address);
        galaxy.setStatus(OpenStatus.CLOSED);
        galaxy.setCity(city);
        galaxy.setImage(image);
        return galaxy;
    }

    public void updateGalaxy(Galaxy galaxy){
        galaxy.setName(name);
        galaxy.setAddress(address);
        galaxy.setStatus(OpenStatus.CLOSED);
        galaxy.setCity(city);
        galaxy.setImage(image);
    }
}
