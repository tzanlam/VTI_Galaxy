package demo.services.interfaceClass;

import demo.modal.dto.SeatRoomDto;
import demo.modal.request.SeatRoomRequest;

import java.util.List;

public interface SeatRoomService {
    // get
    List<SeatRoomDto> getAllSeatRooms();
    SeatRoomDto getSeatRoomById(int id);

    // post
    List<SeatRoomDto> createSeatRoom(SeatRoomRequest request);

    // put
    SeatRoomDto changeName(int seatRoomId, String name);
}
