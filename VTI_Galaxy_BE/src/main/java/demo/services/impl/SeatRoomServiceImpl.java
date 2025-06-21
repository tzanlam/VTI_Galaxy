package demo.services.impl;

import demo.modal.constant.SeatType;
import demo.modal.constant.OpenStatus;
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
    private final ShowTimeRepository showTimeRepository;

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
                () -> new RuntimeException("No seat room found with id: " + id)
        );
        if (seatRoom.getSeat() == null) {
            throw new RuntimeException("SeatRoom with id " + id + " has no associated seat");
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
            throw new RuntimeException("Failed to retrieve seat rooms: " + e.getMessage());
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
            throw new RuntimeException("Failed to retrieve seat rooms: " + e.getMessage());
        }
    }

    @Override
    public List<SeatRoomDto> createSeatRoom(SeatRoomRequest request) {
        Room room = roomRepository.findById(request.getRoomId()).orElseThrow(
                () -> new RuntimeException("No room found with id: " + request.getRoomId())
        );
        ShowTime showTime = showTimeRepository.findById(request.getShowtimeId()).orElseThrow(
                () -> new RuntimeException("No showtime found with id: " + request.getShowtimeId())
        );

        List<SeatRoomDto> seatRoomDtos = new ArrayList<>();
        String[] rowLabels = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"};
        int seatNumber = 1; // Biến đếm số thứ tự liên tục

        try {
            // Kiểm tra giới hạn cột (A-Z) và hàng (tối đa 30 ghế mỗi cột)
            if (request.getQuantityColumn() > rowLabels.length) {
                throw new RuntimeException("QuantityColumn exceeds maximum limit of " + rowLabels.length + " rows (A-Z).");
            }
            if (request.getSeatPerRow() > 30) {
                throw new RuntimeException("SeatPerRow exceeds maximum limit of 30 seats per row.");
            }
            if (request.getQuantityColumn() * request.getSeatPerRow() > 780) {
                throw new RuntimeException("Total seats exceed maximum limit of 780 (26 rows × 30 seats per row).");
            }

            for (int i = 0; i < request.getQuantityColumn(); i++) {
                for (int j = 1; j <= request.getSeatPerRow(); j++) {
                    Seat seat = new Seat();
                    String seatName = rowLabels[i] + seatNumber; // Sử dụng seatNumber để đánh số liên tục
                    seat.setName(seatName);
                    if (i == 0) {
                        seat.setType(SeatType.VIP);
                        seat.setPrice(180000);
                    } else if (i == request.getQuantityColumn() - 1) {
                        seat.setType(SeatType.DOUBLE);
                        seat.setPrice(120000);
                    } else {
                        seat.setType(SeatType.STANDARD);
                        seat.setPrice(90000);
                    }
                    seat.setRoom(room);
                    seat.setStatus(OpenStatus.OPEN);
                    Seat savedSeat = seatRepository.save(seat);

                    SeatRoom seatRoom = new SeatRoom();
                    seatRoom.setSeat(savedSeat);
                    seatRoom.setRoom(room);
                    seatRoom.setShowTime(showTime);
                    seatRoom.setStatus(SeatRoom.BookedStatus.AVAILABLE);
                    SeatRoom savedSeatRoom = seatRoomRepository.save(seatRoom);
                    seatRoomDtos.add(new SeatRoomDto(savedSeatRoom));
                    seatNumber++; // Tăng số thứ tự
                }
            }
            return seatRoomDtos;
        } catch (Exception e) {
            throw new RuntimeException("Seat room creation failed: " + e.getMessage());
        }
    }


    @Override
    public SeatRoomDto changeStatus(int seatRoomId, SeatRoom.BookedStatus status) {
        SeatRoom seatRoom = seatRoomRepository.findById(seatRoomId).orElseThrow(
                () -> new RuntimeException("No seat room found with id: " + seatRoomId)
        );
        if (seatRoom.getSeat() == null) {
            throw new RuntimeException("SeatRoom with id " + seatRoomId + " has no associated seat");
        }
        try {
            seatRoom.setStatus(status);
            seatRoomRepository.save(seatRoom);
            return new SeatRoomDto(seatRoom);
        } catch (Exception e) {
            throw new RuntimeException("Seat room status change failed: " + e.getMessage());
        }
    }
}