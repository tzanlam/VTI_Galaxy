package demo.services.impl;

import demo.modal.constant.SeatType;
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
        String[] rowLabels = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y"};

        try {
            if (request.getQuantityColumn() <= rowLabels.length) {
                for (int i = 0; i < request.getQuantityColumn(); i++) {
                    for (int j = 1; j <= request.getSeatPerRow(); j++) {
                        Seat seat = new Seat();
                        String seatName = rowLabels[i] + j;
                        seat.setName(seatName);
                        seat.setType(SeatType.STANDARD);
                        seat.setPrice(90000);
                        seat.setRoom(room);
                        Seat savedSeat = seatRepository.save(seat);

                        SeatRoom seatRoom = new SeatRoom();
                        seatRoom.setSeat(savedSeat);
                        seatRoom.setRoom(room);
                        seatRoom.setShowTime(showTime);
                        seatRoom.setStatus(SeatRoom.BookedStatus.AVAILABLE);
                        SeatRoom savedSeatRoom = seatRoomRepository.save(seatRoom);
                        seatRoomDtos.add(new SeatRoomDto(savedSeatRoom));
                    }
                }
            } else {
                throw new RuntimeException("QuantityColumn exceeds the maximum limit of rows.");
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