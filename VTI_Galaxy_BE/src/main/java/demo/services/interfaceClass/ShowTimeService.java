package demo.services.interfaceClass;

import demo.modal.dto.ShowTimeDto;

import java.util.List;

public interface ShowTimeService {
    // get
    List<ShowTimeDto> findAll();
    ShowTimeDto findByDateAndMovie(int galaxyId, int movieId, String date);

    // post
    ShowTimeDto create(int galaxyId, int movieId, String date, List<Integer> startTimeId);

    // update
    ShowTimeDto updateShowTime(int id, int galaxyId, int movieId, String date, List<Integer> startTimeId);
}
