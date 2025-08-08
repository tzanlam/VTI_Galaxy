package demo.services.interfaceClass;

import demo.modal.dto.StartTimeDTO;

import java.util.List;

public interface StartTimeService {
    // get
    List<StartTimeDTO> getAllStartTime();
    StartTimeDTO getStartTimeById(int id);

    List<String> getStartTimeByMovie(int movieId);
    // create
    List<StartTimeDTO> createListStartTime(List<String> times, int showTimeIds);
}
