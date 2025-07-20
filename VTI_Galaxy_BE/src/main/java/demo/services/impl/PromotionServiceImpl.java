//package demo.services.impl;
//
//import demo.modal.dto.PromotionDto;
//import demo.modal.entity.Promotion;
//import demo.modal.request.PromotionRequest;
//import demo.repository.PromotionRepository;
//import demo.services.interfaceClass.PromotionService;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class PromotionServiceImpl implements PromotionService {
//    private final PromotionRepository promotionRepository;
//
//    public PromotionServiceImpl(PromotionRepository promotionRepository) {
//        this.promotionRepository = promotionRepository;
//    }
//
//    @Override
//    public List<PromotionDto> getAllPromotions() {
//        return promotionRepository.findAll().stream()
//                .map(PromotionDto::new)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public PromotionDto getPromotionById(int id){
//        Promotion promotion = promotionRepository.findById(id).orElseThrow(
//                () -> new IllegalArgumentException("There is no other with this id")
//        );
//        return new PromotionDto(promotion);
//    }
//
//    @Override
//
//    public PromotionDto createNew(PromotionRequest request) {
//        try{
//        Promotion promotion = request.setPromotion();
//        promotionRepository.save(promotion);
//        return new PromotionDto(promotion);
//    }catch(Exception e){
//            throw new IllegalArgumentException("Create failed: " + e.getMessage());
//        }
//
//    @Override
//    public PromotionDto updatePromotionById(PromotionRequest request, int id) {
//            Promotion promotion =
//            return new PromotionDto(promotion);
//
//    }
//
//    @Override
//    public PromotionDto deletePromotionById(int id) {
//        return null;
//    }
//}
