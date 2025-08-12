package demo.examData;

import demo.modal.constant.OpenStatus;
import demo.modal.entity.Galaxy;
import demo.modal.entity.Room;
import demo.modal.entity.Seat;
import demo.modal.entity.SeatRoom;
import demo.repository.GalaxyRepository;
import demo.repository.RoomRepository;
import demo.repository.SeatRepository;
import demo.repository.SeatRoomRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Configuration
@Order(1)
public class GalaxyDataSeeder {

    @Bean
    CommandLineRunner seedCinemaData(GalaxyRepository galaxyRepo,
                                     RoomRepository roomRepo,
                                     SeatRepository seatRepo,
                                     SeatRoomRepository seatRoomRepo) {
        return args -> {

            // 1. Seed Galaxy nếu chưa có
            if (galaxyRepo.count() == 0) {
                List<Galaxy> galaxies = new ArrayList<>();
                for (int i = 1; i <= 3; i++) {
                    Galaxy g = new Galaxy();
                    g.setName("Galaxy " + i);
                    g.setAddress("Address " + i);
                    g.setImage("image" + i + ".jpg");
                    g.setCity("City " + i);
                    g.setStatus(OpenStatus.OPEN);
                    galaxies.add(g);
                }
                galaxyRepo.saveAll(galaxies);
                System.out.println("Seeded Galaxies");
            }

            // 2. Seed Seat nếu chưa có
            Seat normal = getOrCreateSeat(seatRepo, "Normal", 100_000);
            Seat vip = getOrCreateSeat(seatRepo, "VIP", 150_000);
            Seat couple = getOrCreateSeat(seatRepo, "Couple", 200_000);

            // 3. Seed Room nếu chưa có
            if (roomRepo.count() == 0) {
                List<Room> rooms = new ArrayList<>();
                String[] types = {"2D", "3D", "IMAX"};
                for (Galaxy galaxy : galaxyRepo.findAll()) {
                    for (int i = 1; i <= 3; i++) {
                        Room room = new Room();
                        room.setName("Room " + i);
                        room.setTypeScreen(types[(i - 1) % types.length]);
                        room.setStatus(OpenStatus.OPEN);
                        room.setGalaxy(galaxy);
                        rooms.add(room);
                    }
                }
                roomRepo.saveAll(rooms);
                System.out.println("Seeded Rooms (3 per Galaxy)");
            }

            // 4. Seed SeatRoom nếu chưa có
            if (seatRoomRepo.count() == 0) {
                List<SeatRoom> seatRooms = new ArrayList<>();
                for (Room room : roomRepo.findAll()) {
                    for (char row = 'A'; row <= 'F'; row++) {
                        for (int num = 1; num <= 3; num++) {
                            SeatRoom sr = new SeatRoom();
                            sr.setRoom(room);
                            sr.setName(row + String.valueOf(num));

                            if (row == 'A' || row == 'B') {
                                sr.setSeat(normal);
                            } else if (row == 'C' || row == 'D') {
                                sr.setSeat(vip);
                            } else {
                                sr.setSeat(couple);
                            }
                            seatRooms.add(sr);
                        }
                    }
                }
                seatRoomRepo.saveAll(seatRooms);
                System.out.println("Seeded SeatRooms for all rooms");
            }
        };
    }

    private Seat getOrCreateSeat(SeatRepository repo, String name, int price) {
        Optional<Seat> seatOpt = repo.findByName(name);
        if (seatOpt.isPresent()) {
            return seatOpt.get();
        }
        Seat seat = new Seat();
        seat.setName(name);
        seat.setPrice(price);
        return repo.save(seat);
    }
}
