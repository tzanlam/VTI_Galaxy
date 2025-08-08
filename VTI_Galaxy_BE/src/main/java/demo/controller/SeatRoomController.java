package demo.controller;

import demo.modal.entity.SeatRoom;
import demo.modal.request.SeatRoomRequest;
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

    @GetMapping("/getSeatRooms")
    public ResponseEntity<?> findAllSeatRooms() {
        try {
            return ResponseEntity.ok(seatRoomService.getAllSeatRooms());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getSeatRoomById")
    public ResponseEntity<?> findSeatRoomById(@RequestParam("seatRoomId") int id) {
        try {
            return ResponseEntity.ok(seatRoomService.getSeatRoomById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getSeatRoomByTime/time/{time}")
    public ResponseEntity<?> getSeatRoomByTime(@PathVariable("time") String time) {
        try{
            return ResponseEntity.ok(seatRoomService.getSeatRoomByStartTime(time));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getSeatRoomsByShowtime")
    public ResponseEntity<?> findSeatRoomsByShowtime(@RequestParam("showtimeId") int showtimeId) {
        try {
            return ResponseEntity.ok(seatRoomService.getSeatRoomsByShowtime(showtimeId));
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

    @PostMapping("/postSeatRoom")
    public ResponseEntity<?> postSeatRoom(@RequestBody SeatRoomRequest request) {
        try {
            return ResponseEntity.ok(seatRoomService.createSeatRoom(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putSeatRoomStatus")
    public ResponseEntity<?> changeSeatRoomStatus(@RequestParam("seatRoomId") int seatRoomId,
                                                  @RequestParam("status") String status) {
        try {
            return ResponseEntity.ok(seatRoomService.changeStatus(seatRoomId, SeatRoom.BookedStatus.valueOf(status)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}