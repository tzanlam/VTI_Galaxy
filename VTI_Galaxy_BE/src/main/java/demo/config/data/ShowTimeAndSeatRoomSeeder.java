package demo.config.data;

import demo.modal.entity.*;
import demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Configuration
public class ShowTimeAndSeatRoomSeeder {

    @Bean
    CommandLineRunner seedShowTimes(
            ShowTimeRepository showTimeRepo,
            GalaxyRepository galaxyRepo,
            RoomRepository roomRepo,
            MovieRepository movieRepo,
            SeatRepository seatRepo,
            StartTimeRepository startTimeRepo,
            SeatRoomRepository seatRoomRepo
    ) {
        return args -> {
            LocalDate today = LocalDate.now();
            List<Galaxy> galaxies = galaxyRepo.findAll();
            List<Movie> movies = movieRepo.findAll();
            List<Seat> seats = seatRepo.findAll();

            if (galaxies.isEmpty() || movies.size() < 2 || seats.isEmpty()) {
                System.out.println("⚠️ Missing data: galaxies, movies (>=2), or seats");
                return;
            }

            for (Galaxy galaxy : galaxies) {
                List<Room> rooms = roomRepo.findByGalaxyId(galaxy.getId());

                for (Room room : rooms) {
                    boolean hasShowTimeToday = showTimeRepo.existsByRoomIdAndDate(room.getId(), today);
                    if (hasShowTimeToday) continue;

                    // Chọn ngẫu nhiên 2 bộ phim khác nhau
                    Collections.shuffle(movies);
                    List<Movie> selectedMovies = movies.subList(0, 2);

                    for (int i = 0; i < 2; i++) {
                        Movie movie = selectedMovies.get(i);

                        ShowTime showTime = new ShowTime();
                        showTime.setGalaxy(galaxy);
                        showTime.setMovie(movie);
                        showTime.setRoom(room);
                        showTime.setDate(today);
                        showTimeRepo.save(showTime);

                        // Tạo 1 startTime ngẫu nhiên cho mỗi showtime
                        LocalTime start = LocalTime.of(9 + i * 3, 0); // ví dụ: 09:00, 12:00
                        StartTime startTime = new StartTime();
                        startTime.setShowTime(showTime);
                        startTime.setTime(start);
                        startTimeRepo.save(startTime);

                        // Tạo SeatRoom cho mỗi seat
                        int seatIndex = 1;
                        for (Seat seat : seats) {
                            for (int row = 1; row <= 3; row++) { // 3 hàng cho mỗi loại seat
                                for (int col = 1; col <= 5; col++) { // 5 cột
                                    SeatRoom seatRoom = new SeatRoom();
                                    seatRoom.setSeat(seat);
                                    seatRoom.setRoom(room);
                                    seatRoom.setStartTime(startTime);
                                    seatRoom.setName(seat.getName().charAt(0) + "" + row + col);
                                    seatRoom.setStatus(SeatRoom.BookedStatus.AVAILABLE);
                                    seatRoomRepo.save(seatRoom);
                                    seatIndex++;
                                }
                            }
                        }

                        System.out.printf("✅ Created ShowTime: [%s - %s - %s - %s]%n",
                                galaxy.getName(), room.getName(), movie.getName(), start);
                    }
                }
            }
        };
    }
}
