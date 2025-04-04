package demo.repository;

import demo.modal.entity.ShowTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ShowTimeRepository extends JpaRepository<ShowTime, Integer> {
    @Query("select s from ShowTime s where s.galaxy.id = :galaxyId and s.movie = :movieId and s.date = :date")
    Optional<ShowTime> findByDateAndMovie(@Param("galaxyId") int galaxyId, @Param("movieId") int movieId, @Param("date") LocalDate date);
}
