package demo.services.impl.repository;

import demo.modal.entity.StartTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StartTimeRepository extends JpaRepository<StartTime, Long> {
}
