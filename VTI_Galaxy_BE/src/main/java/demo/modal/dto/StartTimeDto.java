package demo.modal.dto;

import demo.modal.entity.StartTime;
import lombok.Data;

@Data
public class StartTimeDto {
    private int id;
    private String startTime;
    private String endTime;

    public StartTimeDto(StartTime startTime) {
        this.id = startTime.getId();
        this.startTime = startTime.getStartTime() != null ? startTime.getStartTime().toString() : null;
        this.endTime = startTime.getEndTime() != null ? startTime.getEndTime().toString() : null;
    }
}
