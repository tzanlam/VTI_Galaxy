package demo.examData;

import demo.modal.constant.OpenStatus;
import demo.modal.entity.Galaxy;
import demo.modal.entity.Room;
import demo.repository.GalaxyRepository;
import demo.repository.RoomRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.ArrayList;
import java.util.List;

@Configuration
@Order(2)
public class RoomSeeder {
    @Bean
    CommandLineRunner seedRooms(RoomRepository roomRepo, GalaxyRepository galaxyRepo) {
        return args -> {
            if (roomRepo.count() == 0) {
                List<Galaxy> galaxies = galaxyRepo.findAll();
                List<Room> rooms = new ArrayList<>();

                for (Galaxy galaxy : galaxies) {
                    rooms.addAll(populateRooms(galaxy));
                }

                roomRepo.saveAll(rooms);
                System.out.println("Seeded Rooms (3 per Galaxy)");
            }
        };
    }

    private List<Room> populateRooms(Galaxy galaxy) {
        List<Room> rooms = new ArrayList<>();
        String[] types = {"2D", "3D", "IMAX"};

        for (int i = 1; i <= 3; i++) {
            Room room = new Room();
            room.setName("Room " + i);
            room.setTypeScreen(types[(i - 1) % types.length]);
            room.setStatus(OpenStatus.OPEN);
            room.setGalaxy(galaxy);
            rooms.add(room);
        }
        return rooms;
    }
}
