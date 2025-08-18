package demo.services.impl;

import demo.modal.dto.SeatBookedDTO;
import demo.modal.entity.Room;
import demo.modal.entity.SeatBooked;
import demo.modal.entity.StartTime;
import demo.repository.RoomRepository;
import demo.repository.SeatBookedRepository;
import demo.repository.StartTimeRepository;
import demo.services.interfaceClass.SeatBookedService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static demo.support.MethodSupport.convertToLocalTime;

@Service
@RequiredArgsConstructor
public class SeatBookedServiceImpl implements SeatBookedService {
    private final SeatBookedRepository seatBookedRepository;
    private final RoomRepository roomRepository;
    private final StartTimeRepository startTimeRepository;

    @Override
    public List<SeatBookedDTO> getByRoomAndTime(int roomId, String time, String date) {
        Room room = roomRepository.findById(roomId).orElseThrow(()-> new RuntimeException("Room Not Found"));
        StartTime startTime = startTimeRepository.findByTime(convertToLocalTime(time)).orElseThrow(
                () -> new RuntimeException("Start time not found")
        );
        List<SeatBooked> seatBooked = seatBookedRepository.findByRoomIdAndTime(roomId, convertToLocalTime(time)).orElseThrow(
                () -> new RuntimeException("Seat Booked Not Found")
        );
        return seatBooked.stream().map(SeatBookedDTO::new).collect(Collectors.toList());
    }
}
