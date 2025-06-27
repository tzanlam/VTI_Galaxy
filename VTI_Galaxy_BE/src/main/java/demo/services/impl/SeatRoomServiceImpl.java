package demo.services.impl;

import demo.modal.dto.SeatRoomDto;
import demo.modal.entity.Room;
import demo.modal.entity.Seat;
import demo.modal.entity.SeatRoom;
import demo.modal.request.SeatRoomRequest;
import demo.repository.RoomRepository;
import demo.repository.SeatRepository;
import demo.repository.SeatRoomRepository;
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

    public SeatRoomServiceImpl(SeatRoomRepository seatRoomRepository, SeatRepository seatRepository,
                               RoomRepository roomRepository) {
        this.seatRoomRepository = seatRoomRepository;
        this.seatRepository = seatRepository;
        this.roomRepository = roomRepository;
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
        Seat seat = seatRepository.findById(request.getSeatId()).orElseThrow(
                () -> new RuntimeException("No seat found with id: " + request.getSeatId())
        );

        String[] rowLabels = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
                "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                "U", "V", "W", "X", "Y", "Z"};

        int totalSeats = request.getQuantityColumn() * request.getSeatPerRow();
        if (request.getQuantityColumn() > rowLabels.length) {
            throw new RuntimeException("QuantityColumn exceeds maximum row limit: " + rowLabels.length);
        }
        if (totalSeats > room.getCapacity()) {
            throw new RuntimeException("Requested seats exceed room capacity: " + room.getCapacity());
        }

        List<SeatRoom> seatRoomList = new ArrayList<>();

        for (int i = 0; i < request.getQuantityColumn(); i++) {
            String row = rowLabels[i];
            for (int j = 1; j <= request.getSeatPerRow(); j++) {
                SeatRoom seatRoom = new SeatRoom();
                seatRoom.setName(row + j); // VD: A1, A2, ...
                seatRoom.setRoom(room);
                seatRoom.setSeat(seat);
                seatRoom.setStatus(SeatRoom.BookedStatus.AVAILABLE);
                seatRoomList.add(seatRoom);
            }
        }
        seatRoomRepository.saveAll(seatRoomList);
        return seatRoomList.stream().map(seatRoom -> new SeatRoomDto(seatRoom)).collect(Collectors.toList());
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