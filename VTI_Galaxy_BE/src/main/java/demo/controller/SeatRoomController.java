package demo.controller;

import demo.services.interfaceClass.SeatRoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class SeatRoomController {
    private final SeatRoomService seatRoomService;

    public SeatRoomController(SeatRoomService seatRoomService) {
        this.seatRoomService = seatRoomService;
    }
    @GetMapping("/getSeatRoomById")
    public ResponseEntity<?> findSeatRoomById(@RequestParam("seatRoomId") int id) {
        try {
            return ResponseEntity.ok(seatRoomService.getSeatRoomById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getSeatRoomsByRoomId")
    public ResponseEntity<?> findSeatRoomsByRoomId(@RequestParam("roomId") int roomId) {
        try {
            return ResponseEntity.ok(seatRoomService.getSeatRoomsByRoomId(roomId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}