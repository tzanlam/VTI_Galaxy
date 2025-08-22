package demo.repository;

import demo.modal.entity.Room;
import demo.modal.entity.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShowTimeRepository extends JpaRepository<ShowTime, Integer> {
    @Query("SELECT s FROM ShowTime s LEFT JOIN FETCH s.startTimes WHERE s.room.id = :roomId " +
            "AND s.movie.id = :movieId " +
            "AND s.date = :date")
    Optional<ShowTime> findByDateAndMovieAndRoom(
            @Param("roomId") int roomId,
            @Param("movieId") int movieId,
            @Param("date") LocalDate date
    );

    @Query("SELECT s FROM ShowTime s WHERE (:galaxyId IS NULL OR s.galaxy.id = :galaxyId) " +
            "AND (:movieId IS NULL OR s.movie.id = :movieId) " +
            "AND (:date IS NULL OR s.date = :date)")
    List<ShowTime> findByFilter(
            @Param("galaxyId") Integer galaxyId,
            @Param("movieId") Integer movieId,
            @Param("date") LocalDate date
    );

    @Query("select s from ShowTime s where s.room.id = :roomId")
    Optional<List<ShowTime>> findByRoom(@Param("roomId") int roomId);

    @Query("select  s from ShowTime  s where s.room.id = :roomId and s.date = :date")
    Optional<List<ShowTime>> findByRoomAndDate(@Param("roomId") int roomId, @Param("date") LocalDate date);

    @Query("SELECT s FROM ShowTime s WHERE s.room.galaxy.id = :galaxyId " +
            "AND s.movie.id = :movieId " +
            "AND s.date = :date")
    List<ShowTime> findByMovieIdAndDateAndGalaxyId(
            @Param("movieId") int movieId,
            @Param("date") LocalDate date,
            @Param("galaxyId") int galaxyId
    );

    boolean existsByDate(LocalDate now);

    @Query("""
    SELECT DISTINCT r
    FROM ShowTime st
    JOIN st.startTimes s
    JOIN st.room r
    WHERE st.movie.id = :movieId
      AND st.galaxy.id = :galaxyId
      AND s.time = :time
      AND st.date = :date
""")
    Room findRoomByMovieGalaxyAndStartTimeId(
            @Param("movieId") int movieId,
            @Param("galaxyId") int galaxyId,
            @Param("time") LocalTime time,
            @Param("date") LocalDate date
    );
}