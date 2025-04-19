package demo.services.interfaceClass;

import demo.modal.dto.ShowTimeDto;

import java.util.List;

public interface ShowTimeService {
    List<ShowTimeDto> findAll();
    ShowTimeDto findById(int id);
    ShowTimeDto findByDateAndMovie(int galaxyId, int movieId, String date);
    List<ShowTimeDto> findByFilter(Integer galaxyId, Integer movieId, String date);
    ShowTimeDto create(int galaxyId, int movieId, String date, List<Integer> startTimeId);
    ShowTimeDto updateShowTime(int id, int galaxyId, int movieId, String date, List<Integer> startTimeId);
    void delete(int id);
}