package demo.modal.dto;

import demo.modal.entity.ShowTime;
import demo.modal.entity.StartTime;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ShowTimeDto {
    private int id;
    private String galaxyName;
    private String movieName;
    private String date;
    private List<String> startTimes;

    public ShowTimeDto(ShowTime showTime) {
        this.id = showTime.getId();
        this.galaxyName = getGalaxyName(showTime);
        this.movieName = getMovieName(showTime);
        this.date = formatDate(showTime);
        this.startTimes = mapStartTimes(showTime);
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

    private List<String> mapStartTimes(ShowTime showTime) {
        if (showTime.getStartTimes() == null) {
            throw new NullPointerException("startTimes is null");
        }
        List<StartTime> st = showTime.getStartTimes();
        startTimes = new ArrayList<>();
        for (StartTime stTime : st) {
            startTimes.add(stTime.getStartTime().toString());
        }

        return startTimes;
    }
}