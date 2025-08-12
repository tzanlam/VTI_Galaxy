package demo.services.interfaceClass;

import demo.modal.dto.RoomDto;
import demo.modal.request.RoomRequest;

import java.util.List;

public interface RoomService {
    // get
    List<RoomDto> getAllRooms();
    RoomDto getRoomById(int id);
    List<RoomDto> getByGalaxy(int galaxyId);
    RoomDto getRoomByShowTime(int movieId, int galaxyId, String startTime);

    // post
    RoomDto createRoom(RoomRequest request);

    // put
    RoomDto updateRoom(RoomRequest request, int id);

    // delete (closed)
    RoomDto closeRoom(int id);
}
