package demo.repository;

import demo.modal.entity.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShowTimeRepository extends JpaRepository<ShowTime, Integer> {
    @Query("SELECT s FROM ShowTime s WHERE s.galaxy.id = :galaxyId " +
            "AND s.movie.id = :movieId " +
            "AND s.date = :date")
    Optional<ShowTime> findByDateAndMovie(
            @Param("galaxyId") int galaxyId,
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
}