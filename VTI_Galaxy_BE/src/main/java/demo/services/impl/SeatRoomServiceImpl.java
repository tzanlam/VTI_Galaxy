package demo.services.impl;

import demo.modal.dto.SeatRoomDto;
import demo.modal.entity.Room;
import demo.modal.entity.Seat;
import demo.modal.entity.SeatRoom;
import demo.modal.entity.ShowTime;
import demo.modal.request.SeatRoomRequest;
import demo.repository.RoomRepository;
import demo.repository.SeatRepository;
import demo.repository.SeatRoomRepository;
import demo.repository.ShowTimeRepository;
import demo.services.interfaceClass.SeatRoomService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatRoomServiceImpl implements SeatRoomService {
    private final SeatRoomRepository seatRoomRepository;
    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;
    private final ShowTimeRepository showTimeRepository; // Thêm

    public SeatRoomServiceImpl(SeatRoomRepository seatRoomRepository, SeatRepository seatRepository,
                               RoomRepository roomRepository, ShowTimeRepository showTimeRepository) {
        this.seatRoomRepository = seatRoomRepository;
        this.seatRepository = seatRepository;
        this.roomRepository = roomRepository;
        this.showTimeRepository = showTimeRepository;
    }

    @Override
    public List<SeatRoomDto> getAllSeatRooms() {
        return seatRoomRepository.findAll().stream()
                .filter(seatRoom -> seatRoom.getSeat() != null)
                .map(SeatRoomDto::new)
                .collect(Collectors.toList());
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
    public List<SeatRoomDto> getSeatRoomsByShowtime(int showtimeId) {
        try {
            List<SeatRoom> seatRooms = seatRoomRepository.findByShowTimeId(showtimeId);
            return seatRooms.stream()
                    .filter(seatRoom -> seatRoom.getSeat() != null)
                    .map(SeatRoomDto::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Không thể lấy danh sách ghế phòng: " + e.getMessage());
        }
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

    @Override
    public List<SeatRoomDto> createSeatRoom(SeatRoomRequest request) {
        Room room = roomRepository.findById(request.getRoomId()).orElseThrow(
                () -> new RuntimeException("Không tìm thấy phòng với id: " + request.getRoomId())
        );
        Seat seat = seatRepository.findById(request.getSeatId()).orElseThrow(
                () -> new RuntimeException("Không tìm thấy ghế với id: " + request.getSeatId())
        );
        ShowTime showTime = showTimeRepository.findById(request.getShowtimeId()).orElseThrow(
                () -> new RuntimeException("Không tìm thấy suất chiếu với id: " + request.getShowtimeId())
        );

        String[] rowLabels = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
                "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                "U", "V", "W", "X", "Y", "Z"};

        if (request.getQuantityColumn() > rowLabels.length) {
            throw new RuntimeException("Số lượng cột vượt quá giới hạn hàng tối đa: " + rowLabels.length);
        }
        List<SeatRoom> seatRoomList = new ArrayList<>();

        for (int i = 0; i < request.getQuantityColumn(); i++) {
            String row = rowLabels[i];
            for (int j = 1; j <= request.getSeatPerRow(); j++) {
                SeatRoom seatRoom = new SeatRoom();
                seatRoom.setName(row + j); // Ví dụ: A1, A2, ...
                seatRoom.setRoom(room);
                seatRoom.setSeat(seat);
                seatRoom.setShowTime(showTime); // Đặt suất chiếu
                seatRoom.setStatus(SeatRoom.BookedStatus.AVAILABLE);
                seatRoomList.add(seatRoom);
            }
        }
        seatRoomRepository.saveAll(seatRoomList);
        return seatRoomList.stream().map(SeatRoomDto::new).collect(Collectors.toList());
    }

    @Override
    public SeatRoomDto changeStatus(int seatRoomId, SeatRoom.BookedStatus status) {
        SeatRoom seatRoom = seatRoomRepository.findById(seatRoomId).orElseThrow(
                () -> new RuntimeException("Không tìm thấy ghế phòng với id: " + seatRoomId)
        );
        if (seatRoom.getSeat() == null) {
            throw new RuntimeException("Ghế phòng với id " + seatRoomId + " không có ghế liên kết");
        }
        try {
            seatRoom.setStatus(status);
            seatRoomRepository.save(seatRoom);
            return new SeatRoomDto(seatRoom);
        } catch (Exception e) {
            throw new RuntimeException("Thay đổi trạng thái ghế phòng thất bại: " + e.getMessage());
        }
    }
}