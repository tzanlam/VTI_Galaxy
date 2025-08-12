package demo.services.impl;

import demo.modal.dto.SeatRoomDto;
import demo.modal.entity.*;
import demo.repository.SeatRoomRepository;
import demo.services.interfaceClass.SeatRoomService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class SeatRoomServiceImpl implements SeatRoomService {
    private final SeatRoomRepository seatRoomRepository;

    public SeatRoomServiceImpl(SeatRoomRepository seatRoomRepository) {
        this.seatRoomRepository = seatRoomRepository;
    }

    @Override
    public SeatRoomDto getSeatRoomById(int id) {
        SeatRoom seatRoom = seatRoomRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Không tìm thấy ghế phòng với id: " + id)
        );
        if (seatRoom.getSeat() == null) {
            throw new RuntimeException("Ghế phòng với id " + id + " không có ghế liên kết");
        }
        return new SeatRoomDto(seatRoom);
    }

    @Override
    public List<SeatRoomDto> getSeatRoomsByRoomId(int roomId) {
        try {
            List<SeatRoom> seatRooms = seatRoomRepository.findByRoomId(roomId);
            return seatRooms.stream()
                    .filter(seatRoom -> seatRoom.getSeat() != null)
                    .map(SeatRoomDto::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Không thể lấy danh sách ghế phòng: " + e.getMessage());
        }
    }
}