package demo.services.impl.repository;

import demo.modal.entity.Other;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtherRepository extends JpaRepository<Other,Integer> {
}
