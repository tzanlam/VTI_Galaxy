package demo.examData;

import demo.modal.constant.ActiveStatus;
import demo.modal.entity.Galaxy;
import demo.modal.entity.Other;
import demo.repository.GalaxyRepository;
import demo.repository.OtherRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.List;

@Configuration
@Order(9)
public class OtherSeeder {

    @Bean
    CommandLineRunner seedOthers(OtherRepository otherRepo, GalaxyRepository galaxyRepo) {
        return args -> {
            if (otherRepo.count() == 0) {
                List<Galaxy> galaxies = galaxyRepo.findAll();

                if (galaxies.isEmpty()) {
                    System.out.println("⚠️ No galaxy found. Please seed galaxy data first.");
                    return;
                }

                for (Galaxy galaxy : galaxies) {
                    Other popcorn = new Other();
                    popcorn.setName("Bắp Ngọt");
                    popcorn.setDescription("Bắp rang bơ thơm ngon");
                    popcorn.setImage_url("https://example.com/images/popcorn.jpg");
                    popcorn.setPrice(45000);
                    popcorn.setQuantity(100);
                    popcorn.setGalaxy(galaxy);
                    popcorn.setStatus(ActiveStatus.ACTIVE);

                    Other combo = new Other();
                    combo.setName("Combo 2 Bắp 2 Nước");
                    combo.setDescription("Combo tiết kiệm cho 2 người");
                    combo.setImage_url("https://example.com/images/combo.jpg");
                    combo.setPrice(90000);
                    combo.setQuantity(100);
                    combo.setGalaxy(galaxy);
                    combo.setStatus(ActiveStatus.ACTIVE);

                    otherRepo.saveAll(List.of(popcorn, combo));
                    System.out.println("✅ Seeded bắp và combo cho galaxy");
                }
            }
        };
    }
}
