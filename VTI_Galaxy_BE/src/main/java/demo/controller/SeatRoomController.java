package demo.controller;

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
        try{
            return ResponseEntity.ok(seatRoomService.getAllSeatRooms());
        }catch (Exception e){
            return ResponseEntity.ofNullable(e.getMessage());
        }
    }

    @GetMapping("/getSeatRoomById")
    public ResponseEntity<?> findSeatRoomById(@RequestParam("seatRoomId")int id) {
        try{
            return ResponseEntity.ok(seatRoomService.getSeatRoomById(id));
        }catch (Exception e){
            return ResponseEntity.ofNullable(e.getMessage());
        }
    }

    @PostMapping("/postSeatRoom")
    public ResponseEntity<?> postSeatRoom(@RequestBody SeatRoomRequest request) {
        try{
            return ResponseEntity.ok(seatRoomService.createSeatRoom(request));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putSeatRoomName")
    public ResponseEntity<?> changeSeatRoomName(@RequestParam("seatRoomId") int seatRoomId, @RequestParam("seatRoomName") String seatRoomName) {
        try{
            return ResponseEntity.ok(seatRoomService.changeName(seatRoomId, seatRoomName));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
