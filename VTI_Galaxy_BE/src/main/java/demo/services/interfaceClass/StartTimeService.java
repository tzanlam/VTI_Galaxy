package demo.services.interfaceClass;

import demo.modal.dto.StartTimeDto;

import java.util.List;

public interface StartTimeService {
    // get
    List<StartTimeDto> getStartTimeList();

    // post
    StartTimeDto createStartTime(String startTime, String endTime);

    List<Integer> getStartTimeIdsByTimes(List<String> startTimes);
}
