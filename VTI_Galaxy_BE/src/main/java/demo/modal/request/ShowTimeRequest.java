package demo.modal.request;

import lombok.Data;

@Data
public class ShowTimeRequest {
    private String galaxyId;
    private String movieId;
    private String date;
    private String startTimes;
}
