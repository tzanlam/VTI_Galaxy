package demo.controller;

import demo.modal.request.ShowTimeRequest;
import demo.services.interfaceClass.ShowTimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class ShowTimeController {
    private final ShowTimeService showTimeService;

    public ShowTimeController(ShowTimeService showTimeService) {
        this.showTimeService = showTimeService;
    }

    @GetMapping("/getShowTimes")
    public ResponseEntity<?> findAllShowTimes() {
        try {
            return ResponseEntity.ok(showTimeService.findAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getShowTime/{id}")
    public ResponseEntity<?> findShowTimeById(@PathVariable("id") int id) {
        try {
            return ResponseEntity.ok(showTimeService.findById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getShowTimeByMovieDateAndRoom ")
    public ResponseEntity<?> getByMovieDateAndGalaxy(@RequestParam("movieId") int movie,@RequestParam("date") String date, @RequestParam("roomId") int roomId) {
        try{
            return ResponseEntity.ok(showTimeService.findByDateAndMovie(roomId, movie, date));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getShowTimeByRoom")
    public ResponseEntity<?> getByRoom(@RequestParam("roomId") int roomId) {
        try{
            return ResponseEntity.ok(showTimeService.
                    findShowTimeByRoom(roomId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getShowTimeByRoomAndDate")
    public ResponseEntity<?> getByRoomAndDate(@RequestParam("roomId") int roomId, @RequestParam("date") String date) {
        try{
            return ResponseEntity.ok(showTimeService.findByDateAndRoom(roomId, date));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getShowTimeByMovieDateAndGalaxy")
    public ResponseEntity<?> findByDateAndMovieAndGalaxy(
            
            @RequestParam("movieId") int movieId,
            @RequestParam("date") String date,
            @RequestParam("galaxyId") int galaxyId
    ) {
        try {
            return ResponseEntity.ok(showTimeService.findByDateAndMovieAndGalaxy(movieId, date, galaxyId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/getShowTimesByFilter")
    public ResponseEntity<?> getShowTimesByFilter(
            @RequestParam(value = "galaxyId", required = false) String galaxyId,
            @RequestParam(value = "movieId", required = false) String movieId,
            @RequestParam(value = "date", required = false) String date
    ) {
        try {
            Integer parsedGalaxyId = galaxyId != null ? Integer.parseInt(galaxyId) : null;
            Integer parsedMovieId = movieId != null ? Integer.parseInt(movieId) : null;
            return ResponseEntity.ok(showTimeService.findByFilter(parsedGalaxyId, parsedMovieId, date));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("galaxyId hoặc movieId không hợp lệ");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/postShowTime")
    public ResponseEntity<?> createShowTime(@RequestBody ShowTimeRequest request) {
        try {
            return ResponseEntity.ok(showTimeService.create(request));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("galaxyId, movieId hoặc startTimes không hợp lệ");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putShowTime/{showTimeId}")
    public ResponseEntity<?> updateShowTime(
            @PathVariable("showTimeId") int showTimeId,
            @RequestBody ShowTimeRequest request
    ) {
        try {
            return ResponseEntity.ok(showTimeService.updateShowTime(
                    showTimeId,
                    request.getGalaxyId(),
                    request.getRoomId(),
                    request.getMovieId(),
                    request.getDate(), request.getStartTimes()
            ));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("galaxyId, movieId hoặc startTimes không hợp lệ");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/deleteShowTime/{id}")
    public ResponseEntity<?> deleteShowTime(@PathVariable("id") int id) {
        try {
            showTimeService.delete(id);
            return ResponseEntity.ok("Xóa lịch chiếu thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}