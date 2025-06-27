package demo.services.impl;

import demo.modal.dto.SeatDto;
import demo.modal.entity.Seat;
import demo.modal.request.SeatRequest;
import demo.repository.SeatRepository;
import demo.services.interfaceClass.SeatService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatServiceImpl implements SeatService {
    private final SeatRepository seatRepository;

    public SeatServiceImpl(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    @Override
    public List<SeatDto> getAllSeats() {
        return seatRepository.findAll().stream().map(SeatDto::new).collect(Collectors.toList());
    }

    @Override
    public SeatDto getSeatById(int id) {
        Seat seat = seatRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Seat not found")
        );
        return new SeatDto(seat);
    }

    @Override
    public SeatDto addSeat(SeatRequest request) {
        try {
            Seat seat = new Seat();
            request.modal(seat);
            seatRepository.save(seat);
            return new SeatDto(seat);
        }catch (Exception e){
            throw new RuntimeException("created seat fail");
        }
    }

    @Override
    public SeatDto updateSeat(SeatRequest request, int id) {
        Seat seat = seatRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Seat not found")
        );
        try{
            request.modal(seat);
            seatRepository.save(seat);
            return new SeatDto(seat);
        }catch (Exception e){
            throw new RuntimeException("updated seat fail");
        }
    }
}
