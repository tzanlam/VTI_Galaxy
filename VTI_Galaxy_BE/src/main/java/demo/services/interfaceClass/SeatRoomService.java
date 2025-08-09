package demo.services.interfaceClass;

import demo.modal.dto.SeatRoomDto;
import demo.modal.entity.SeatRoom;
import demo.modal.request.SeatRoomRequest;

import java.util.List;

public interface SeatRoomService {
    // get
    List<SeatRoomDto> getAllSeatRooms();

    SeatRoomDto getSeatRoomById(int id);

    List<SeatRoomDto> getSeatRoomsByRoomId(int roomId);

    List<SeatRoomDto> getSeatRoomByStartTime(String time,  int galaxyId, int movieId);

    // post
    List<SeatRoomDto> createSeatRoom(SeatRoomRequest request);

    // put
    SeatRoomDto changeStatus(int seatRoomId, SeatRoom.BookedStatus status);

    // get by showtime
    List<SeatRoomDto> getSeatRoomsByShowtime(int showtimeId);
}
