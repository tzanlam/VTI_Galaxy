package demo.modal.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import demo.modal.entity.ShowTime;
import lombok.Data;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class ShowTimeDto {
    private int id;
    private String galaxyName;
    private int roomId;
    private int movieId;
    private String date;
    private int galaxyId;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<String> startTimes;

    public ShowTimeDto(ShowTime showTime) {
        this.id = showTime.getId();
        this.galaxyName = showTime.getGalaxy() != null ? showTime.getGalaxy().getName() : "not found";
        this.roomId = showTime.getRoom().getId();
        this.movieId = showTime.getMovie().getId();
        this.date = showTime.getDate() != null ? showTime.getDate().toString() : "not found";
        this.galaxyId = showTime.getGalaxy().getId();
        this.startTimes = mapTime(showTime);
    }

    private List<String> mapTime(ShowTime showTime){
        List<String> st = new ArrayList<>();
        for (LocalTime std : showTime.getStartTimes()){
            st.add(std.toString());
        }
        return st;
    }

}