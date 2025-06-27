package demo.services.interfaceClass;

import demo.modal.dto.SeatDto;
import demo.modal.request.SeatRequest;

import java.util.List;

public interface SeatService {
    // get
    List<SeatDto> getAllSeats();
    SeatDto getSeatById(int id);

    // post
    SeatDto addSeat(SeatRequest request);

    // put
    SeatDto updateSeat(SeatRequest request, int id);
}
