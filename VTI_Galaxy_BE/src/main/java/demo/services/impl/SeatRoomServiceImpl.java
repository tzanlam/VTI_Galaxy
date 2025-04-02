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

    public SeatRoomServiceImpl(SeatRoomRepository seatRoomRepository, SeatRepository seatRepository, RoomRepository roomRepository) {
        this.seatRoomRepository = seatRoomRepository;
        this.seatRepository = seatRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public List<SeatRoomDto> getAllSeatRooms() {
        return seatRoomRepository.findAll().stream().map(SeatRoomDto::new).collect(Collectors.toList());
    }

    @Override
    public SeatRoomDto getSeatRoomById(int id) {
        SeatRoom seatRoom = seatRoomRepository.findById(id).orElseThrow(
                () -> new RuntimeException("No seat room found with id: " + id)
        );
        return new SeatRoomDto(seatRoom);
    }

    @Override
    public List<SeatRoomDto> createSeatRoom(SeatRoomRequest request) {
        Seat seat = seatRepository.findById(request.getSeatId()).orElseThrow(
                () -> new RuntimeException("No seat found with id: " + request.getSeatId())
        );
        Room room = roomRepository.findById(request.getRoomId()).orElseThrow(
                () -> new RuntimeException("No room found with id: " + request.getRoomId())
        );

        List<SeatRoomDto> seatRoomList = new ArrayList<>();
        String[] rowLabels = new String[]{"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y"};

        if (request.getQuantityColumn() <= rowLabels.length) {
            for (int i = 0; i < request.getQuantityColumn(); i++) {
                for (int j = 1; j <= request.getSeatPerRow(); j++) {
                    SeatRoom seatRoom = new SeatRoom();
                    seatRoom.setSeat(seat);
                    seatRoom.setRoom(room);
                    seatRoom.setStatus(SeatRoom.BookedStatus.AVAILABLE);
                    String seatName = rowLabels[i] + j;
                    seatRoom.setName(seatName);
                    seatRoomRepository.save(seatRoom);
                }
            }
        } else {
            throw new RuntimeException("QuantityColumn exceeds the maximum limit of rows.");
        }

        return seatRoomList;
    }


    @Override
    public SeatRoomDto changeName(int seatRoomId, String name) {
        SeatRoom seatRoom = seatRoomRepository.findById(seatRoomId).orElseThrow(
                () -> new RuntimeException("No seat found with id: " + seatRoomId)
        );
        seatRoom.setName(name);
        seatRoomRepository.save(seatRoom);
        return new SeatRoomDto(seatRoom);
    }
}
