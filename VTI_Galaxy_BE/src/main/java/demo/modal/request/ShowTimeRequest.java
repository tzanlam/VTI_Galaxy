package demo.modal.request;

import lombok.Data;

import java.util.List;

@Data
public class ShowTimeRequest {
    private int  galaxyId;
    private int roomId;
    private int movieId;
    private String date;
    private List<Integer> startTimes;
}
