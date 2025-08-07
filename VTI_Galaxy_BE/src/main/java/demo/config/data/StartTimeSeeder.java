package demo.config.data;

import demo.modal.entity.ShowTime;
import demo.modal.entity.StartTime;
import demo.repository.ShowTimeRepository;
import demo.repository.StartTimeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Configuration
public class StartTimeSeeder {

    @Bean
    CommandLineRunner seedStartTimes(StartTimeRepository startTimeRepo, ShowTimeRepository showTimeRepo) {
        return args -> {
            if (startTimeRepo.count() == 0) {
                Optional<ShowTime> optionalShowTime = showTimeRepo.findById(1);
                if (optionalShowTime.isEmpty()) {
                    System.out.println("⚠️ Không tìm thấy ShowTime với id = 1 để seed StartTime.");
                    return;
                }

                ShowTime showTime = optionalShowTime.get();

                List<StartTime> startTimes = new ArrayList<>();
                for (int i = 0; i < 10; i++) {
                    StartTime st = new StartTime();
                    st.setTime(LocalTime.of(8 + i, 0)); // từ 08:00 đến 17:00
                    st.setShowTime(showTime);
                    startTimes.add(st);
                }

                startTimeRepo.saveAll(startTimes);
                System.out.println("✅ Seeded 10 StartTime entries (08:00 - 17:00)");
            }
        };
    }
}
