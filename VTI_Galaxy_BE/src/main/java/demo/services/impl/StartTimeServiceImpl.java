package demo.services.impl;

import demo.modal.dto.StartTimeDto;
import demo.modal.entity.StartTime;
import demo.repository.StartTimeRepository;
import demo.services.interfaceClass.StartTimeService;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import static demo.support.MethodSupport.convertToLocalTime;

@Service
public class StartTimeServiceImpl implements StartTimeService {
    private final StartTimeRepository startTimeRepository;

    public StartTimeServiceImpl(StartTimeRepository startTimeRepository) {
        this.startTimeRepository = startTimeRepository;
    }

    @Override
    public List<StartTimeDto> getStartTimeList() {
        return startTimeRepository.findAll().stream().map(StartTimeDto::new).collect(Collectors.toList());
    }

    @Override
    public StartTimeDto createStartTime(String startTime, String endTime) {
        StartTime st = new StartTime();
        st.setStartTime(convertToLocalTime(startTime));
        st.setEndTime(convertToLocalTime(endTime));
        startTimeRepository.save(st);
        return new StartTimeDto(st);
    }
    @Override
    public List<Integer> getStartTimeIdsByTimes(List<String> startTimes) {
        return startTimes.stream()
                .map(time -> {
                    LocalTime localTime = LocalTime.parse(time, DateTimeFormatter.ofPattern("HH:mm"));
                    StartTime startTime = startTimeRepository.findByStartTime(localTime)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy thời gian bắt đầu: " + time));
                    return startTime.getId();
                })
                .collect(Collectors.toList());
    }
}
