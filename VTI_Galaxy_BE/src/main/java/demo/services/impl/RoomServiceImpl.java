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
    public int getRoomByShowTime(int movieId, int galaxyId, String startTime, String date) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(
                () -> new IllegalArgumentException("Phim không tồn tại với ID: " + movieId)
        );
        Galaxy galaxy = galaxyRepository.findById(galaxyId).orElseThrow(
                () -> new IllegalArgumentException("Rạp không tồn tại với ID: " + galaxyId)
        );
            LocalDate localDate = convertToLocalDate(date);
        return showTimeRepository.findRoomByMovieGalaxyAndStartTimeId(movieId, galaxyId, convertToLocalTime(startTime), localDate);
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
