package demo.services.impl;

import demo.modal.entity.SeatRoom;
import demo.repository.SeatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SeatRoomCleanupScheduler {
    @Autowired
    private SeatRoomRepository seatRoomRepository;

    @Scheduled(fixedRate = 60000) // Chạy mỗi phút
    @Transactional
    public void cleanupSelectedSeats() {
        LocalDateTime timeoutThreshold = LocalDateTime.now().minusMinutes(10);
        List<SeatRoom> selectedSeats = seatRoomRepository.findByStatusAndModifiedBefore(
                SeatRoom.BookedStatus.valueOf(SeatRoom.BookedStatus.SELECTED.toString()), timeoutThreshold);
        for (SeatRoom seatRoom : selectedSeats) {
            seatRoom.setStatus(SeatRoom.BookedStatus.valueOf(SeatRoom.BookedStatus.AVAILABLE.toString()));
            seatRoom.setModified(LocalDateTime.now());
            seatRoomRepository.save(seatRoom);
        }
    }
}
