package demo.controller;

import demo.services.interfaceClass.StartTimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin("*")
public class StartTimeController {
    private final StartTimeService startTimeService;

    public StartTimeController(StartTimeService startTimeService) {
        this.startTimeService = startTimeService;
    }

    @GetMapping("/getStartTimes")
    public ResponseEntity<?> GetStartTimes() {
        try {
            return ResponseEntity.ok(startTimeService.getStartTimeList());
        } catch (Exception e) {
            return ResponseEntity.ofNullable("Danh sách thời gian bắt đầu rỗng");
        }
    }

    @PostMapping("/postStartTime")
    public ResponseEntity<?> create(@RequestBody Map<String, String> request) {
        try {
            String startTime = request.get("startTime");
            String endTime = request.get("endTime");
            return ResponseEntity.ok(startTimeService.createStartTime(startTime, endTime));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Tạo thời gian bắt đầu thất bại");
        }
    }
}