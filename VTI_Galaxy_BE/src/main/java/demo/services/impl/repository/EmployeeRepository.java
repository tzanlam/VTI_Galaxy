package demo.services.impl.repository;

import demo.modal.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    @Query("select e from Employee e where e.galaxy.id = :galaxyId")
    Optional<List<Employee>> findByGalaxyId(@Param("galaxyId") int galaxyId);
}
