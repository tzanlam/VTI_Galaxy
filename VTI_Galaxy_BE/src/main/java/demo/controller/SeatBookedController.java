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

    @GetMapping("/roomId/{roomId}/time/{time}")
    public ResponseEntity<?> getSeatBooked(@PathVariable int roomId, @PathVariable String time){
        try{
            return ResponseEntity.ok(seatBookedService.getByRoomAndTime(roomId, time));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
