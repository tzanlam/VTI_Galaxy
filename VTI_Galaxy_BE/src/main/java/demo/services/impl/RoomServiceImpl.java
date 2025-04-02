package demo.services.impl;

import demo.modal.constant.OpenStatus;
import demo.modal.dto.RoomDto;
import demo.modal.entity.Room;
import demo.modal.request.RoomRequest;
import demo.repository.GalaxyRepository;
import demo.repository.RoomRepository;
import demo.services.interfaceClass.RoomService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final GalaxyRepository galaxyRepository;

    public RoomServiceImpl(RoomRepository roomRepository,GalaxyRepository galaxyRepository1) {
        this.roomRepository = roomRepository;
        this.galaxyRepository = galaxyRepository1;
    }

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
    public RoomDto createRoom(RoomRequest request) {
        Room room = request.addRoom();
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
