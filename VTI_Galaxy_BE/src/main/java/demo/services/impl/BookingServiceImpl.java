package demo.services.impl;

import demo.modal.constant.BookingStatus;
import demo.modal.dto.BookingDto;
import demo.modal.entity.Booking;
import demo.modal.entity.Other;
import demo.modal.entity.SeatRoom;
import demo.modal.request.BookingRequest;
import demo.repository.*;
import demo.services.interfaceClass.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static demo.support.MethodSupport.calculatePriceBooking;

@Service
public class BookingServiceImpl implements BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private GalaxyRepository galaxyRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private SeatRoomRepository seatRoomRepository;

    @Autowired
    private OtherRepository otherRepository;

    @Override
    public List<BookingDto> getBookings() {
        return bookingRepository.findAll().stream()
                .map(BookingDto::new)
                .collect(Collectors.toList());

    }

    @Override
    public BookingDto getBookingById(int id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Booking not found with id: " + id)
        );
        return new BookingDto(booking);
    }

    @Override
    @Transactional
    public BookingDto createBooking(BookingRequest request) {
        Booking booking = new Booking();
        try {
            if (Objects.nonNull(request.getVoucherId())) {
                voucherRepository.findById(request.getVoucherId()).ifPresentOrElse(
                        booking::setVoucher,
                        () -> booking.setVoucher(null)
                );
            } else {
                booking.setVoucher(null);
            }
            booking.setGalaxy(galaxyRepository.findById(request.getGalaxyId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy rạp")));
            for (String j : request.getOtherIds()){
                Other other = otherRepository.findById(Integer.parseInt(j)).orElseThrow(
                        () -> new RuntimeException("ghế không tồn tại")
                );
                if (Objects.isNull(booking.getOther())){
                    booking.setOther(new ArrayList<>());
                }
                booking.getOther().add(other);
            }
            for (String i : request.getSeatRoomIds()){
                SeatRoom seatRoom = seatRoomRepository.findById(Integer.parseInt(i)).orElseThrow(
                        () -> new RuntimeException("ghế không tồn tại")
                );
                if (Objects.isNull(booking.getSeatRooms())){
                    booking.setSeatRooms(new ArrayList<>());
                }
                booking.getSeatRooms().add(seatRoom);
            }
            booking.setTotalPrice(calculatePriceBooking(booking.getSeatRooms(), booking.getOther(), booking.getVoucher()));
            booking.setStatus(BookingStatus.PENDING);
            bookingRepository.save(booking);
            return new BookingDto(booking);
        }catch(Exception e){
            throw new IllegalArgumentException(("Create failed: " + e.getMessage()));
        }
    }

    @Override
    @Transactional
    public BookingDto updateBooking(int id, BookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt vé"));
        request.updateBooking(booking);
        if (request.getGalaxyId() != 0) {
            booking.setGalaxy(galaxyRepository.findById(request.getGalaxyId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy rạp")));
        }
        if (request.getVoucherId() != 0) {
            booking.setVoucher(voucherRepository.findById(request.getVoucherId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy voucher")));
        }
        booking = bookingRepository.save(booking);
        return new BookingDto(booking);
    }

    @Override
    public BookingDto deleteBooking(int id) {
        return null;
    }
}
