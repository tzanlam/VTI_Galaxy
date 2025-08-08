package demo.services.impl;

import demo.modal.dto.StartTimeDTO;
import demo.modal.entity.ShowTime;
import demo.modal.entity.StartTime;
import demo.repository.ShowTimeRepository;
import demo.repository.StartTimeRepository;
import demo.services.interfaceClass.StartTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StartTimeServiceImpl implements StartTimeService {
    private final StartTimeRepository startTimeRepository;
    private final ShowTimeRepository showTimeRepository;

    @Override
    public List<StartTimeDTO> getAllStartTime() {
        return startTimeRepository.findAll().stream().map(StartTimeDTO::new).collect(Collectors.toList());
    }

    @Override
    public StartTimeDTO getStartTimeById(int id) {
        StartTime startTime = startTimeRepository.findById(id).orElseThrow(
                () -> new RuntimeException("null")
        );
        return new StartTimeDTO(startTime);
    }

    @Override
    public List<String> getStartTimeByMovie(int movieId) {
        List<StartTime> startTimes = startTimeRepository.findByMovieId(movieId).orElseThrow(
                () -> new RuntimeException("null")
        );
        List<String> listTime = new ArrayList<>();
        for (StartTime startTime : startTimes) {
            listTime.add(startTime.getTime().toString());
        }
        return listTime;
    }

    @Override
    public List<StartTimeDTO> createListStartTime(List<String> times, int showTimes) {
        ShowTime showTime = showTimeRepository.findById(showTimes).orElseThrow(
                () -> new RuntimeException("null")
        );
        List<StartTime> savedStartTimes = new ArrayList<>();

        for (String timeStr : times) {
            LocalTime time = LocalTime.parse(timeStr); // Format phải là "HH:mm"

            StartTime startTime = new StartTime();
            startTime.setShowTime(showTime);
            startTime.setTime(time);

            savedStartTimes.add(startTimeRepository.save(startTime));
        }
        return savedStartTimes.stream()
                .map(StartTimeDTO::new)
                .collect(Collectors.toList());
    }
}
