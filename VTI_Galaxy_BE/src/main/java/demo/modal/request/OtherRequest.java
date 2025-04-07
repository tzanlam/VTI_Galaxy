package demo.modal.request;

import demo.modal.entity.Other;
import lombok.Data;

@Data
public class OtherRequest {
    private String type;
    private String name;
    private int price;
    private int quantity;

    public Other setOther(){
        Other other = new Other();
        other.setType(type);
        other.setName(name);
        other.setPrice(price);
        other.setQuantity(quantity);
        return other;
    }

    public void updateOther(Other other){
        other.setType(type);
        other.setName(name);
        other.setPrice(price);
        other.setQuantity(quantity);
    }
}
