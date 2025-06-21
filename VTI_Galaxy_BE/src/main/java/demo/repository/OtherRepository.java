package demo.repository;

import demo.modal.entity.Other;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OtherRepository extends JpaRepository<Other,Integer> {
    List<Other> findByGalaxyAndStatus(int galaxy, String status);
}
