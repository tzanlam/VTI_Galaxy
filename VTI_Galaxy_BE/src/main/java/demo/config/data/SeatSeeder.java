package demo.config.data;

import demo.modal.entity.Seat;
import demo.repository.SeatRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SeatSeeder {
    @Bean
    CommandLineRunner seedSeats(SeatRepository seatRepo) {
        return args -> {
            if (seatRepo.count() == 0) {
                Seat standard = new Seat();
                standard.setName("Standard");
                standard.setPrice(100);

                Seat vip = new Seat();
                vip.setName("VIP");
                vip.setPrice(150);

                Seat couple = new Seat();
                couple.setName("Couple");
                couple.setPrice(200);

                seatRepo.saveAll(List.of(standard, vip, couple));
                System.out.println("Seeded 3 seat types (Standard, VIP, Couple)");
            }
        };
    }
}
