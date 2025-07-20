package demo.modal.request;

import demo.modal.constant.ActiveStatus;
import demo.modal.entity.Other;
import demo.modal.entity.Promotion;
import lombok.Data;

@Data
public class PromotionRequest {
    private String title;
    private String description;
    private String image;
    private String cta;
    private String link;

    public Promotion setPromotion(){
        Promotion promotion = new Promotion();
        promotion.setTitle(title);
        promotion.setDescription(description);
        promotion.setImage(image);
        promotion.setCta(cta);
        promotion.setLink(link);
        return promotion;
    }
    public void updatePromotion(Promotion promotion){

    }
}
