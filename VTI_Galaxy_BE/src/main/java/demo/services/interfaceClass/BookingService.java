package demo.services.interfaceClass;

import demo.modal.dto.BookingDto;
import demo.modal.request.BookingRequest;

import java.util.List;

public interface BookingService {
    List<BookingDto> getBookings();

    BookingDto getBookingById(int id);

    BookingDto createBooking(BookingRequest request);

    BookingDto updateBooking(int id, BookingRequest request);

    BookingDto deleteBooking(int id);

    List<BookingDto> getBookingsByAccountId(int accountId);
}
