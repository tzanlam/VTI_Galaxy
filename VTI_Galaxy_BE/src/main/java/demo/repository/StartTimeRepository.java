package demo.repository;

import demo.modal.entity.StartTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StartTimeRepository extends JpaRepository<StartTime, Integer> {
    @Query("select st from StartTime st where st.showTime.movie.id = :movieId")
    Optional<List<StartTime>> findByMovieId(int movieId);
}
