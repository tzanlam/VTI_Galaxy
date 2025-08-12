package demo.repository;

import demo.modal.entity.SeatBooked;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeatBookedRepository extends JpaRepository<SeatBooked, Integer> {
    @Query("select sb from SeatBooked sb where sb.showTime.id = :showTimeId and sb.seatRoom.id = :seatRoomId")
    Optional<SeatBooked> findByShowTimeIdAndSeatRoomId(@Param("showTimeId") int showTimeId, @Param("seatRoomId") int seatRoomId);

    @Query("""
    SELECT sb
    FROM SeatBooked sb
    JOIN sb.seatRoom sr
    JOIN sr.room r
    JOIN sb.showTime st
    JOIN st.startTimes sTime
    WHERE r.id = :roomId
      AND sTime.time = :time
""")
    Optional<List<SeatBooked>> findByRoomIdAndTime(@Param("roomId") int roomId, @Param("time") LocalTime time);
}
