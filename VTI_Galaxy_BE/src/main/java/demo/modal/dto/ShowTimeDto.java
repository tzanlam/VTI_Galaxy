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
    private String movieName;
    private String date;
    private int galaxyId;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<String> startTimes;

    public ShowTimeDto(ShowTime showTime) {
        this.id = showTime.getId();
        this.galaxyName = getGalaxyName(showTime);
        this.movieName = getMovieName(showTime);
        this.date = formatDate(showTime);
        this.galaxyId = showTime.getGalaxy().getId();
        this.startTimes = mapTime(showTime);
    }

    private String getGalaxyName(ShowTime showTime) {
        return showTime.getGalaxy() != null && showTime.getGalaxy().getName() != null
                ? showTime.getGalaxy().getName() : "Không xác định";
    }

    private String getMovieName(ShowTime showTime) {
        return showTime.getMovie() != null && showTime.getMovie().getName() != null
                ? showTime.getMovie().getName() : "Không xác định";
    }

    private String formatDate(ShowTime showTime) {
        return showTime.getDate() != null ? showTime.getDate().toString() : null;
    }

    private List<String> mapTime(ShowTime showTime){
        List<String> st = new ArrayList<>();
        for (LocalTime std : showTime.getStartTimes()){
            st.add(std.toString());
        }
        return st;
    }

}