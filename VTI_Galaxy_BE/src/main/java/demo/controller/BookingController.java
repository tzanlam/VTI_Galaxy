package demo.controller;

import demo.modal.request.BookingRequest;
import demo.services.interfaceClass.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/getBookings")
    public ResponseEntity<?> getBooking() {
        try{
            return ResponseEntity.ok(bookingService.getBookings());
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getBookingById")
    public ResponseEntity<?> getBookingById(@RequestParam("bookingId") int id) {
        try{
            return ResponseEntity.ok(bookingService.getBookingById(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/postBooking")
    public ResponseEntity<?> postBooking(@RequestBody BookingRequest request){
        try{
            return ResponseEntity.ok(bookingService.createBooking(request));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putBooking")
    public ResponseEntity<?> putBooking(@RequestBody BookingRequest request, @RequestParam("bookingId") int bookingId){
        try{
            return ResponseEntity.ok(bookingService.updateBooking(bookingId, request));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/deleteBooking")
    public ResponseEntity<?> deleteBooking(@RequestParam("bookingId") int bookingId){
        try{
            return ResponseEntity.ok(bookingService.deleteBooking(bookingId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
