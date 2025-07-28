package demo.support;

import demo.modal.entity.Account;
import demo.modal.entity.Booking;
import demo.repository.AccountRepository;
import demo.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MethodSchedule {
    private final BookingRepository bookingRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public void addPointAfterPayment (int bookingId){
        try {
            Booking booking = bookingRepository.findById(bookingId).orElseThrow(
                    () -> new RuntimeException("Booking not found!")
            );
            Account account = accountRepository.findById(booking.getAccount().getId()).orElseThrow(
                    () -> new RuntimeException("Account not found!")
            );
            account.setPoint(booking.getTotalPrice()/1000);
            accountRepository.save(account);
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}
