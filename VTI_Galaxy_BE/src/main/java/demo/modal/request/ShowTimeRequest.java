package demo.modal.request;

import lombok.Data;

import java.util.List;

@Data
public class ShowTimeRequest {
    private String galaxyId;
    private String movieId;
    private String date;
    private List<String> startTimes;
}
