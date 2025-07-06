package demo.repository;

import demo.modal.entity.VnpayTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VnpayTransactionRepository extends JpaRepository<VnpayTransaction, Long> {
}