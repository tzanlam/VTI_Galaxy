package demo.repository;

import demo.modal.entity.SeatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRoomRepository extends JpaRepository<SeatRoom, Integer> {
    List<SeatRoom> findByShowTimeId(int showTimeId);

    List<SeatRoom> findByRoomId(int roomId);
}