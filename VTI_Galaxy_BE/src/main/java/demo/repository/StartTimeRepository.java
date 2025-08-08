package demo.repository;

import demo.modal.entity.StartTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StartTimeRepository extends JpaRepository<StartTime, Integer> {
    @Query("select st from StartTime st where st.showTime.movie.id = :movieId and st.showTime.date = :date")
    Optional<List<StartTime>> findByMovieIdAndDate(@Param("movieId") int movieId, @Param("date") LocalDate date);
}
