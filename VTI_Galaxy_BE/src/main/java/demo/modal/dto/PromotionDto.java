package demo.modal.dto;

import demo.modal.entity.Promotion;
import lombok.Data;

@Data
public class PromotionDto {
    private Long id;
    private String title;
    private String description;
    private String image;
    private String cta;
    private String link;

    public PromotionDto(Promotion promotion){
        this.id= promotion.getId();
        this.title=promotion.getTitle();
        this.description=promotion.getDescription();
        this.image=promotion.getImage();
        this.cta=promotion.getCta();
    }
}
