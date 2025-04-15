package demo.services.impl.repository;

import demo.modal.entity.Galaxy;
import demo.modal.entity.Other;
import demo.modal.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GalaxyRepository extends JpaRepository<Galaxy, Integer> {
    @Query("select g.rooms from Galaxy g where g.id = :galaxyId")
    List<Room> findRooms(@Param("galaxyId") int galaxyId);

    @Query("select g.others from Galaxy g where g.id = :galaxyId")
    Optional<List<Other>> findOthers(@Param("galaxyId") int galaxyId);
}
