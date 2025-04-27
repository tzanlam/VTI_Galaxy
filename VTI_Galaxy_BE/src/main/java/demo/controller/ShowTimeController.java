package demo.controller;

import demo.modal.request.ShowTimeRequest;
import demo.services.interfaceClass.ShowTimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/getShowTimeByMovieDateAndGalaxy")
    public ResponseEntity<?> getByMovieDateAndGalaxy(@RequestParam("movieId") int movie,@RequestParam("date") String date, @RequestParam("galaxyId") int galaxyId) {
        try{
            return ResponseEntity.ok(showTimeService.findByDateAndMovie(galaxyId, movie, date));
        }catch (Exception e){
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
            List<Integer> startTimeIds = parseStartTimes(request.getStartTimes());
            return ResponseEntity.ok(showTimeService.create(
                    Integer.parseInt(request.getGalaxyId()),
                    Integer.parseInt(request.getMovieId()),
                    request.getDate(),
                    startTimeIds
            ));
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
            List<Integer> startTimeIds = parseStartTimes(request.getStartTimes());
            return ResponseEntity.ok(showTimeService.updateShowTime(
                    showTimeId,
                    Integer.parseInt(request.getGalaxyId()),
                    Integer.parseInt(request.getMovieId()),
                    request.getDate(),
                    startTimeIds
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

    private List<Integer> parseStartTimes(String startTimes) {
        if (startTimes == null || startTimes.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(startTimes.split(","))
                .map(String::trim)
                .map(Integer::parseInt)
                .collect(Collectors.toList());
    }
}