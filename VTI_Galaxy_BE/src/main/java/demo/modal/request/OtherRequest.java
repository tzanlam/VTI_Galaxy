package demo.modal.request;

import demo.modal.constant.ActiveStatus;
import demo.modal.entity.Other;
import lombok.Data;

@Data
public class OtherRequest {
    private String name;
    private String description;
    private String image_url;
    private int price;
    private int quantity;
    private ActiveStatus activeStatus;
    private int galaxyId;

    public Other setOther(){
        Other other = new Other();
        other.setName(name);
        other.setDescription(description);
        other.setImage_url(image_url);
        other.setPrice(price);
        other.setQuantity(quantity);
        return other;
    }

    public void updateOther(Other other){
        other.setName(name);
        other.setDescription(description);
        other.setImage_url(image_url);
        other.setPrice(price);
        other.setQuantity(quantity);

    }
}
