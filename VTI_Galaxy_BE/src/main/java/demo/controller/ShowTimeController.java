package demo.controller;

import demo.services.interfaceClass.ShowTimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class ShowTimeController {
    private final ShowTimeService showTimeService;

    public ShowTimeController(ShowTimeService showTimeService) {
        this.showTimeService = showTimeService;
    }

    @GetMapping("/getShowTimes")
    public ResponseEntity<?> findAllShowTimes() {
        try{
            return ResponseEntity.ok(showTimeService.findAll());
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getShowTimeByDateAndMovie")
    public ResponseEntity<?> getShowTime(@RequestParam("galaxyId") int galaxyId, @RequestParam("movieId") int movieId, @RequestParam("date") String date) {
        try{
            return ResponseEntity.ok(showTimeService.findByDateAndMovie(galaxyId, movieId, date));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/postShowTime")
    public ResponseEntity<?> createShowTime(@RequestParam("galaxyId") int galaxyId, @RequestParam("movieId") int movieId, @RequestParam("date") String date, @RequestParam("startTimeIds")List<Integer> startTimeIds) {
        try{
            return ResponseEntity.ok(showTimeService.create(galaxyId, movieId, date, startTimeIds));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putShowTime")
    public ResponseEntity<?> updateShowTime(@RequestParam("showTimeId") int showTimeId, @RequestParam("galaxyId") int galaxyId, @RequestParam("movieId") int movieId, @RequestParam("date") String date, @RequestParam("startTimeIds")List<Integer> startTimeIds) {
        try{
            return ResponseEntity.ok(showTimeService.updateShowTime(showTimeId, galaxyId, movieId, date, startTimeIds));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
