package demo.repository;

import demo.modal.entity.SeatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface SeatRoomRepository extends JpaRepository<SeatRoom, Integer> {
    @Query("SELECT sr FROM SeatRoom sr JOIN FETCH sr.seat s JOIN sr.startTime st JOIN st.showTime sh WHERE sh.id = :showtimeId")
    List<SeatRoom> findByShowTimeId(@Param("showtimeId") int showtimeId);

    List<SeatRoom> findByRoomId(int roomId);

    List<SeatRoom> findByStatusAndModifiedBefore(SeatRoom.BookedStatus status, LocalDateTime modified);

    @Query("select sr from SeatRoom sr where sr.startTime.time = :time")
    Optional<List<SeatRoom>> findByTime(@Param("time")LocalTime time);
}