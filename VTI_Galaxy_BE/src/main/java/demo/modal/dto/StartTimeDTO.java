package demo.modal.dto;

import demo.modal.entity.StartTime;
import lombok.Data;


@Data
public class StartTimeDTO {
    private int id;
    private int showTimeId;
    private String time;

    public StartTimeDTO(StartTime startTime) {
        this.id = startTime.getId();
        this.showTimeId = startTime.getShowTime().getId();
        this.time = startTime.toString();
    }
}
