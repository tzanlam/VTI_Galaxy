package demo.services.interfaceClass;

import demo.modal.dto.SeatRoomDto;
import java.util.List;

public interface SeatRoomService {
    SeatRoomDto getSeatRoomById(int id);

    List<SeatRoomDto> getSeatRoomsByRoomId(int roomId);
}
