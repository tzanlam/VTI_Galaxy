package demo.examData;

import demo.modal.entity.*;
import demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Configuration
@Order(4)
public class ShowTimeSeeder {

    @Bean
    CommandLineRunner seedShowTimes(GalaxyRepository galaxyRepo,
                                    RoomRepository roomRepo,
                                    MovieRepository movieRepo,
                                    ShowTimeRepository showTimeRepo,
                                    StartTimeRepository startTimeRepo) {
        return args -> {
            if (showTimeRepo.existsByDate(LocalDate.now())) {
                System.out.println("ShowTimes for today already exist. Skipping seeding...");
                return;
            }

            List<Galaxy> galaxies = galaxyRepo.findAll();
            List<Movie> movies = movieRepo.findAll();

            if (galaxies.isEmpty() || movies.size() < 2) {
                System.out.println("Not enough Galaxy or Movie to seed ShowTimes!");
                return;
            }

            List<LocalTime> fixedTimes = Arrays.asList(
                    LocalTime.of(14, 0),
                    LocalTime.of(15, 0),
                    LocalTime.of(16, 0),
                    LocalTime.of(17, 0)
            );

            List<StartTime> startTimesFixed = new ArrayList<>();
            for (LocalTime time : fixedTimes) {
                StartTime st = new StartTime();
                st.setTime(time);
                startTimesFixed.add(startTimeRepo.save(st)); // Lưu trước vào DB
            }

            // === Bước 2: Seed ShowTime ===
            Random random = new Random();

            for (Galaxy galaxy : galaxies) {
                Set<LocalTime> usedTimesInGalaxy = new HashSet<>();
                List<Room> rooms = roomRepo.findByGalaxyId(galaxy.getId());

                for (Room room : rooms) {
                    for (Movie movie : movies) {
                        ShowTime showTime = new ShowTime();
                        showTime.setGalaxy(galaxy);
                        showTime.setMovie(movie);
                        showTime.setRoom(room);
                        showTime.setDate(LocalDate.now());
                        showTime = showTimeRepo.save(showTime);

                        // Chọn giờ chiếu
                        LocalTime time;
                        do {
                            // 50% chọn giờ cố định, 50% tạo giờ random
                            if (random.nextBoolean()) {
                                time = fixedTimes.get(random.nextInt(fixedTimes.size()));
                            } else {
                                int hour = random.nextInt(12) + 8; // 8h - 19h
                                int minute = random.nextBoolean() ? 0 : 30;
                                time = LocalTime.of(hour, minute);
                            }
                        } while (usedTimesInGalaxy.contains(time));

                        usedTimesInGalaxy.add(time);

                        // Liên kết StartTime đã có hoặc tạo mới
                        LocalTime finalTime = time;
                        Optional<StartTime> existing = startTimesFixed.stream()
                                .filter(st -> st.getTime().equals(finalTime))
                                .findFirst();

                        StartTime startTime;
                        if (existing.isPresent()) {
                            startTime = existing.get();
                        } else {
                            startTime = new StartTime();
                            startTime.setTime(time);
                            startTime = startTimeRepo.save(startTime);
                        }

                        // Nếu bạn vẫn muốn map 2 chiều
                        startTime.setShowTime(showTime);
                        startTimeRepo.save(startTime);
                    }
                }
            }

            System.out.println("Seeded ShowTimes & StartTimes successfully.");
        };
    }
}
