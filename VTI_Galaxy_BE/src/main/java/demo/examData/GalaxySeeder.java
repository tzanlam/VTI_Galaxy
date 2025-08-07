package demo.examData;

import demo.modal.constant.OpenStatus;
import demo.modal.entity.Galaxy;
import demo.repository.GalaxyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.List;

@Configuration
@Order(1)
public class GalaxySeeder {
    @Bean
    CommandLineRunner seedGalaxies(GalaxyRepository galaxyRepo) {
        return args -> {
            if (galaxyRepo.count() == 0) {
                Galaxy g1 = new Galaxy();
                g1.setName("Galaxy Nguyễn Trãi");
                g1.setAddress("123 Nguyễn Trãi, Q1, TP.HCM");
                g1.setImage("#");
                g1.setCity("Hồ Chí Minh");
                g1.setStatus(OpenStatus.OPEN);

                Galaxy g2 = new Galaxy();
                g2.setName("Galaxy Quang Trung");
                g2.setAddress("456 Quang Trung, Gò Vấp, TP.HCM");
                g2.setImage("#");
                g2.setCity("Hồ Chí Minh");
                g2.setStatus(OpenStatus.OPEN);

                Galaxy g3 = new Galaxy();
                g3.setName("Galaxy Thủ Đức");
                g3.setAddress("789 Võ Văn Ngân, Thủ Đức, TP.HCM");
                g3.setImage("#");
                g3.setCity("Hồ Chí Minh");
                g3.setStatus(OpenStatus.OPEN);

                Galaxy g4 = new Galaxy();
                g4.setName("Galaxy Hà Đông");
                g4.setAddress("12 Quang Trung, Hà Đông, Hà Nội");
                g4.setImage("#");
                g4.setCity("Hà Nội");
                g4.setStatus(OpenStatus.OPEN);

                Galaxy g5 = new Galaxy();
                g5.setName("Galaxy Long Biên");
                g5.setAddress("34 Nguyễn Văn Cừ, Long Biên, Hà Nội");
                g5.setImage("#");
                g5.setCity("Hà Nội");
                g5.setStatus(OpenStatus.OPEN);

                galaxyRepo.saveAll(List.of(g1, g2, g3, g4, g5));
                System.out.println("Seeded 5 Galaxies (3 HCM, 2 Hà Nội)");
            }
        };
    }
}
