package demo.controller;

import demo.modal.request.RoomRequest;
import demo.services.interfaceClass.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/getRooms")
    public ResponseEntity<?> getRooms() {
        try{
            return ResponseEntity.ok(roomService.getAllRooms());
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getRoomById")
    public ResponseEntity<?> getRoomById(@RequestParam("roomId") int id) {
        try{
            return ResponseEntity.ok(roomService.getRoomById(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getRoomByGalaxy")
    public ResponseEntity<?> getRoomByGalaxy(@RequestParam("galaxyId") int galaxyId) {
        try{
            return ResponseEntity.ok(roomService.getByGalaxy(galaxyId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/postRoom")
    public ResponseEntity<?> postRoom(@RequestBody RoomRequest request) {
        try{
            return ResponseEntity.ok(roomService.createRoom(request));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putRoom")
    public ResponseEntity<?> putRoom(@RequestBody RoomRequest request, @RequestParam("roomId") int roomId) {
        try{
            return ResponseEntity.ok(roomService.updateRoom(request,roomId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putStatusRoom")
    public ResponseEntity<?> closedRoom(@RequestParam("roomId") int roomId) {
        try{
            return ResponseEntity.ok(roomService.closeRoom(roomId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
