package demo.services.impl;

import demo.modal.constant.OpenStatus;
import demo.modal.dto.RoomDto;
import demo.modal.entity.*;
import demo.modal.request.RoomRequest;
import demo.repository.*;
import demo.services.interfaceClass.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import static demo.support.MethodSupport.convertToLocalDate;
import static demo.support.MethodSupport.convertToLocalTime;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final GalaxyRepository galaxyRepository;
    private final ShowTimeRepository showTimeRepository;
    private final MovieRepository movieRepository;

    @Override
    public List<RoomDto> getAllRooms() {
        return roomRepository.findAll().stream().map(RoomDto::new).collect(Collectors.toList());
    }

    @Override
    public RoomDto getRoomById(int id) {
        Room room = roomRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Room not found with id: " + id)
        );
        return new RoomDto(room);
    }

    @Override
    public List<RoomDto> getByGalaxy(int galaxyId) {
        return galaxyRepository.findRooms(galaxyId).stream().map(RoomDto::new).collect(Collectors.toList());
    }

    @Override
    public List<RoomDto> getRoomByShowTime(int movieId, int galaxyId, String startTime, String date) {
        movieRepository.findById(movieId)
                .orElseThrow(() -> new NullPointerException("Movie not found with id: " + movieId));
        galaxyRepository.findById(galaxyId)
                .orElseThrow(() -> new NullPointerException("Galaxy not found with id: " + galaxyId));

        LocalTime start = convertToLocalTime(startTime);
        LocalDate day = convertToLocalDate(date);

        List<Room> rooms = showTimeRepository.findRoomsByMovieGalaxyDateAndStartTimeExists(
                movieId, galaxyId, day, start
        );

        if (rooms.isEmpty()) {
            throw new RuntimeException("Room not found with your condition");
        }

        return rooms.stream().map(RoomDto::new).collect(Collectors.toList());
    }



    @Override
    public RoomDto createRoom(RoomRequest request) {
        Galaxy galaxy = galaxyRepository.findById(request.getGalaxyId()).orElseThrow(
                () -> new NullPointerException("Galaxy not found with id: " + request.getGalaxyId())
        );
        Room room = request.addRoom();
        room.setGalaxy(galaxy);
        try {
            roomRepository.save(room);
            return new RoomDto(room);
        }catch (Exception e){
            throw new RuntimeException("Room creation failed");
        }
    }

    @Override
    public RoomDto updateRoom(RoomRequest request, int id) {
        Room room = roomRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Room not found with id: " + id)
        );
        try{
            request.updateRoom(room);
            roomRepository.save(room);
            return new RoomDto(room);
        }catch (Exception e){
            throw new RuntimeException("Room update failed");
        }
    }

    @Override
    public RoomDto closeRoom(int id) {
        Room room = roomRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Room not found with id: " + id)
        );
        room.setStatus(OpenStatus.CLOSED);
        roomRepository.save(room);
        return new RoomDto(room);
    }
}
