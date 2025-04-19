package demo.modal.dto;

import demo.modal.entity.StartTime;
import lombok.Data;

import java.time.format.DateTimeFormatter;

@Data
public class StartTimeDto {
    private int id;
    private String startTime;
    private String endTime;

    public StartTimeDto(StartTime startTime) {
        this.id = startTime.getId();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        this.startTime = startTime.getStartTime() != null
                ? startTime.getStartTime().format(formatter) : null;
        this.endTime = startTime.getEndTime() != null
                ? startTime.getEndTime().format(formatter) : null;
    }
}