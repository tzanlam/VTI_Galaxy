package demo.controller;

import demo.services.interfaceClass.SeatBookedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/seat_booked")
@RequiredArgsConstructor
public class SeatBookedController {
    private final SeatBookedService seatBookedService;

    @GetMapping("getSeatBooked/{roomId}/{time}/{date}")
    public ResponseEntity<?> getSeatBooked(
            @PathVariable int roomId,
            @PathVariable String time,
            @PathVariable String date
    ) {
        try {
            return ResponseEntity.ok(seatBookedService.getByRoomAndTime(roomId, time, date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}