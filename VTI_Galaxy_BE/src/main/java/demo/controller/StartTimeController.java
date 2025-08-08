package demo.controller;

import demo.services.interfaceClass.StartTimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class StartTimeController {
    private final StartTimeService startTimeService;

    public StartTimeController(StartTimeService startTimeService) {
        this.startTimeService = startTimeService;
    }

    @GetMapping("/movieId/{movieId}/andDate/{date}")
    public ResponseEntity<?> getByMovie(@PathVariable int movieId, @PathVariable String date) {
        try{
            return ResponseEntity.ok(startTimeService.getStartTimeByMovieAndDate(movieId, date));
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/startTimeId/{startTimeId}")
    public ResponseEntity<?> getByStartTime(@PathVariable int startTimeId) {
        try{
            return ResponseEntity.ok(startTimeService.getStartTimeById(startTimeId));
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createStartTime(@RequestParam("times")List<String> times, @RequestParam("showTimeId") int showTimeId) {
        try{
            return ResponseEntity.ok(startTimeService.createListStartTime(times, showTimeId));
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
