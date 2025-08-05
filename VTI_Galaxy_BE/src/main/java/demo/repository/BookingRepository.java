package demo.repository;

import demo.modal.constant.BookingStatus;
import demo.modal.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository  extends JpaRepository<Booking, Integer> {
    // Find bookings by galaxy ID
    List<Booking> findByGalaxyId(int galaxyId);

    // Find bookings by voucher ID
    List<Booking> findByVoucherId(int voucherId);

    // Find bookings by status
    List<Booking> findByStatus(BookingStatus status);

    // Find bookings by galaxy ID and status
    List<Booking> findByGalaxyIdAndStatus(int galaxyId, BookingStatus status);

    Optional<Booking> findByVnpTxnRef(String vnpTxnRef);

    @Query("SELECT b FROM Booking b WHERE b.account.id = :accountId")
    List<Booking> findBookingsByAccountId(@Param("accountId") int accountId);
}
