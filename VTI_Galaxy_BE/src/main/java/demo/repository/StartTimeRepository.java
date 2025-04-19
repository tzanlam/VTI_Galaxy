package demo.repository;

import demo.modal.entity.StartTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.Optional;

@Repository
public interface StartTimeRepository extends JpaRepository<StartTime, Integer> {
    @Query("SELECT st FROM StartTime st WHERE st.startTime = :startTime")
    Optional<StartTime> findByStartTime(@Param("startTime") LocalTime startTime);
}
