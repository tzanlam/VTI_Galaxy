package demo.controller;

import demo.services.interfaceClass.StartTimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class StartTimeController {
    private final StartTimeService startTimeService;

    public StartTimeController(StartTimeService startTimeService) {
        this.startTimeService = startTimeService;
    }

    @GetMapping("/getStartTimes")
    public ResponseEntity<?> GetStartTimes() {
        try{
            return ResponseEntity.ok(startTimeService.getStartTimeList());
        }catch (Exception e){
            return ResponseEntity.ofNullable("List Start Time is null");
        }
    }

    @PostMapping("/postStartTime")
    public ResponseEntity<?> create(@RequestParam("startTime") String startTime, @RequestParam("endTime") String endTime) {
        try{
            return ResponseEntity.ok(startTimeService.createStartTime(startTime, endTime));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Create Start Time is failed");
        }
    }
}
