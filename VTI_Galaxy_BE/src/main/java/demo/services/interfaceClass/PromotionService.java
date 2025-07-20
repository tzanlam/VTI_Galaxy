package demo.services.interfaceClass;

import demo.modal.dto.OtherDto;
import demo.modal.dto.PromotionDto;
import demo.modal.request.OtherRequest;
import demo.modal.request.PromotionRequest;

import java.util.List;

public interface PromotionService {
    // get
    List<PromotionDto> getAllPromotions();
    PromotionDto getPromotionById(int id);

    // post
    PromotionDto createNew(PromotionRequest request);

    // put
    PromotionDto updatePromotionById(PromotionRequest request, int id);

    // delete
    PromotionDto deletePromotionById(int id);
}
