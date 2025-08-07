package demo.examData;

import demo.modal.entity.Voucher;
import demo.repository.VoucherRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
@Order(8)
public class VoucherSeeder {

    @Bean
    CommandLineRunner seedVouchers(VoucherRepository voucherRepo) {
        return args -> {
            if (voucherRepo.count() == 0) {
                LocalDateTime now = LocalDateTime.now();

                Voucher v1 = new Voucher();
                v1.setName("GIAM10");
                v1.setDiscount(10);
                v1.setStartDate(now.minusDays(1));
                v1.setEndDate(now.plusDays(30));

                Voucher v2 = new Voucher();
                v2.setName("GIAM20");
                v2.setDiscount(20);
                v2.setStartDate(now.minusDays(5));
                v2.setEndDate(now.plusDays(20));

                Voucher v3 = new Voucher();
                v3.setName("TET2025");
                v3.setDiscount(25);
                v3.setStartDate(now.minusDays(10));
                v3.setEndDate(now.plusDays(15));

                Voucher v4 = new Voucher();
                v4.setName("VIPONLY");
                v4.setDiscount(30);
                v4.setStartDate(now.minusDays(3));
                v4.setEndDate(now.plusDays(10));

                Voucher v5 = new Voucher();
                v5.setName("WELCOME");
                v5.setDiscount(15);
                v5.setStartDate(now.minusDays(2));
                v5.setEndDate(now.plusDays(60));

                voucherRepo.saveAll(List.of(v1, v2, v3, v4, v5));
                System.out.println("✅ Seeded 5 vouchers.");
            }
        };
    }
}
