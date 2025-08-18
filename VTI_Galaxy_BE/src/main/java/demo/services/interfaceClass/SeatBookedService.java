package demo.services.interfaceClass;

import demo.modal.dto.SeatBookedDTO;

import java.util.List;

public interface SeatBookedService {
    List<SeatBookedDTO> getByRoomAndTime(int roomId, String time, String date);
}
