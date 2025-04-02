package demo.controller;

import demo.modal.request.SeatRequest;
import demo.services.interfaceClass.SeatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class SeatController {
    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/getSeats")
    public ResponseEntity<?> findAllSeats() {
        try{
            return ResponseEntity.ok(seatService.getAllSeats());
        }catch (Exception e){
            return ResponseEntity.ofNullable(e.getMessage());
        }
    }

    @GetMapping("/getSeatById")
    public ResponseEntity<?> findSeatById(@RequestParam("seatId") int id) {
        try{
            return ResponseEntity.ok(seatService.getSeatById(id));
        }catch (Exception e){
            return ResponseEntity.ofNullable(e.getMessage());
        }
    }

    @PostMapping("/postSeat")
    public ResponseEntity<?> createSeat(@RequestBody SeatRequest request) {
        try{
            return ResponseEntity.ok(seatService.addSeat(request));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putSeat")
    public ResponseEntity<?> updateSeat(@RequestBody SeatRequest request, @RequestParam("seatId") int id) {
        try{
            return ResponseEntity.ok(seatService.updateSeat(request,id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putStatusSeat")
    public ResponseEntity<?> updateSeatStatus(@RequestParam("seatId") int id) {
        try{
            return ResponseEntity.ok(seatService.closedSeat(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
