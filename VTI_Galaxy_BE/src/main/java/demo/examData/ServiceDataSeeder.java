package demo.examData;

import demo.modal.constant.ActiveStatus;
import demo.modal.entity.Galaxy;
import demo.modal.entity.Other;
import demo.modal.entity.Voucher;
import demo.repository.GalaxyRepository;
import demo.repository.OtherRepository;
import demo.repository.VoucherRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
@Order(3)
public class ServiceDataSeeder {

    @Bean
    CommandLineRunner seedServiceData(GalaxyRepository galaxyRepo,
                                      OtherRepository otherRepo,
                                      VoucherRepository voucherRepo) {
        return args -> {

            // 1. Seed Other nếu chưa có
            if (otherRepo.count() == 0) {
                List<Other> others = new ArrayList<>();
                List<Galaxy> galaxies = galaxyRepo.findAll();

                for (Galaxy galaxy : galaxies) {
                    // Bắp rang
                    Other popcorn = new Other();
                    popcorn.setName("Bắp rang bơ");
                    popcorn.setDescription("Bắp rang bơ thơm ngon");
                    popcorn.setImage_url("popcorn.jpg");
                    popcorn.setPrice(50000);
                    popcorn.setQuantity(100);
                    popcorn.setGalaxy(galaxy);
                    popcorn.setStatus(ActiveStatus.ACTIVE);
                    others.add(popcorn);

                    // Nước ngọt
                    Other drink = new Other();
                    drink.setName("Nước ngọt");
                    drink.setDescription("Pepsi, Coca, 7Up");
                    drink.setImage_url("drink.jpg");
                    drink.setPrice(30000);
                    drink.setQuantity(200);
                    drink.setGalaxy(galaxy);
                    drink.setStatus(ActiveStatus.ACTIVE);
                    others.add(drink);

                    // Combo
                    Other combo = new Other();
                    combo.setName("Combo Bắp + Nước");
                    combo.setDescription("1 Bắp rang bơ + 1 Nước ngọt");
                    combo.setImage_url("combo.jpg");
                    combo.setPrice(75000);
                    combo.setQuantity(150);
                    combo.setGalaxy(galaxy);
                    combo.setStatus(ActiveStatus.ACTIVE);
                    others.add(combo);
                }

                otherRepo.saveAll(others);
                System.out.println("Seeded Other products for all galaxies");
            }

            // 2. Seed Voucher nếu chưa có
            if (voucherRepo.count() == 0) {
                List<Voucher> vouchers = new ArrayList<>();

                Voucher v1 = new Voucher();
                v1.setName("DISCOUNT10");
                v1.setDiscount(10);
                v1.setStartDate(LocalDateTime.now().minusDays(1));
                v1.setEndDate(LocalDateTime.now().plusDays(30));
                vouchers.add(v1);

                Voucher v2 = new Voucher();
                v2.setName("DISCOUNT20");
                v2.setDiscount(20);
                v2.setStartDate(LocalDateTime.now().minusDays(1));
                v2.setEndDate(LocalDateTime.now().plusDays(15));
                vouchers.add(v2);

                Voucher v3 = new Voucher();
                v3.setName("DISCOUNT50");
                v3.setDiscount(50);
                v3.setStartDate(LocalDateTime.now().minusDays(1));
                v3.setEndDate(LocalDateTime.now().plusDays(7));
                vouchers.add(v3);

                voucherRepo.saveAll(vouchers);
                System.out.println("Seeded Vouchers");
            }
        };
    }
}
