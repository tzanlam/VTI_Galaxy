package demo.repository;

import demo.modal.entity.SeatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeatRoomRepository extends JpaRepository<SeatRoom, Integer> {
    @Query("SELECT sr FROM SeatRoom sr JOIN FETCH sr.seat WHERE sr.showTime.id = :showtimeId")
    List<SeatRoom> findByShowTimeId(@Param("showtimeId") int showtimeId);

    List<SeatRoom> findByRoomId(int roomId);


}