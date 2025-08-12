package demo.services.impl;

import demo.config.VNPay.VNPayConfig;
import demo.modal.constant.BookingStatus;
import demo.modal.dto.BookingDto;
import demo.modal.entity.*;
import demo.modal.request.BookingRequest;
import demo.repository.*;
import demo.services.VNPayService;
import demo.services.interfaceClass.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static demo.support.MethodSupport.calculatePriceBooking;

@Service
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;

    private final ShowTimeRepository showTimeRepository;

    private final GalaxyRepository galaxyRepository;

    private final VoucherRepository voucherRepository;

    private final SeatRoomRepository seatRoomRepository;

    private final OtherRepository otherRepository;

    private final AccountRepository accountRepository;

    private final VNPayService vnPayService;

    private final HttpServletRequest httpServletRequest;

    private final VNPayConfig vnPayConfig;

    private final SeatBookedRepository seatBookedRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, ShowTimeRepository showTimeRepository, GalaxyRepository galaxyRepository, VoucherRepository voucherRepository, SeatRoomRepository seatRoomRepository, OtherRepository otherRepository, AccountRepository accountRepository, VNPayService vnPayService, HttpServletRequest httpServletRequest, VNPayConfig vnPayConfig, SeatBookedRepository sSeatBookedRepository) {
        this.bookingRepository = bookingRepository;
        this.showTimeRepository = showTimeRepository;
        this.galaxyRepository = galaxyRepository;
        this.voucherRepository = voucherRepository;
        this.seatRoomRepository = seatRoomRepository;
        this.otherRepository = otherRepository;
        this.accountRepository = accountRepository;
        this.vnPayService = vnPayService;
        this.httpServletRequest = httpServletRequest;
        this.vnPayConfig = vnPayConfig;
        this.seatBookedRepository = sSeatBookedRepository;
    }

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
    public List<BookingDto> getBookingsByAccountId(int accountId) {
        List<Booking> bookings = bookingRepository.findBookingsByAccountId(accountId);
        if (accountId <= 0) {
            System.err.println("Invalid accountId: " + accountId);
            throw new IllegalArgumentException("ID tài khoản không hợp lệ");
        }
        if (!accountRepository.existsById(accountId)) {
            System.err.println("Account not found with id: " + accountId);
            throw new IllegalArgumentException("Tài khoản không tồn tại");
        }
        if (bookings.isEmpty()) {
            System.out.println("No bookings found for accountId: " + accountId);
            return Collections.emptyList();
        }
        return bookings.stream()
                .map(BookingDto::new)
                .collect(Collectors.toList());
    }



    @Override
    @Transactional
    public BookingDto createBooking(BookingRequest request) {
        if (request.getAccountId() <= 0 || request.getGalaxyId() <= 0 ||
                request.getShowtimeId() <= 0 || request.getSeatRoomIds() == null ||
                request.getSeatRoomIds().isEmpty()) {
            throw new IllegalArgumentException("Missing required fields in booking request");
        }

        Booking booking = new Booking();
        booking.setPaymentMethod(request.getPaymentMethod());

        voucherRepository.findById(request.getVoucherId())
                .ifPresentOrElse(booking::setVoucher, () -> booking.setVoucher(null));

        booking.setAccount(accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found")));

        ShowTime showTime = showTimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Show time not found"));
        booking.setShowTime(showTime);

        booking.setGalaxy(galaxyRepository.findById(request.getGalaxyId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy rạp")));

        // ==== Check & add seats ====
        List<SeatRoom> seatRooms = new ArrayList<>();
        for (String seatRoomIdStr : request.getSeatRoomIds()) {
            int seatRoomId = Integer.parseInt(seatRoomIdStr);
            SeatRoom seatRoom = seatRoomRepository.findById(seatRoomId)
                    .orElseThrow(() -> new RuntimeException("Ghế không tồn tại"));

            // Check trạng thái trong SeatBooked cho suất chiếu này
            Optional<SeatBooked> existingBooking = seatBookedRepository
                    .findByShowTimeIdAndSeatRoomId(showTime.getId(), seatRoom.getId());

            if (existingBooking.isPresent() && existingBooking.get().getStatus() == SeatBooked.SeatRoomStatus.BOOKED) {
                throw new IllegalStateException("Seat " + seatRoom.getName() + " is already booked");
            }

            seatRooms.add(seatRoom);
        }
        booking.setSeatRooms(seatRooms);

        // ==== Combo/Other ====
        List<Other> others = new ArrayList<>();
        if (request.getOtherIds() != null) {
            for (String otherIdStr : request.getOtherIds()) {
                int otherId = Integer.parseInt(otherIdStr);
                Other other = otherRepository.findById(otherId)
                        .orElseThrow(() -> new RuntimeException("Combo không tồn tại"));
                others.add(other);
            }
        }
        booking.setOthers(others);

        // ==== Tính giá ====
        int totalPrice = calculatePriceBooking(seatRooms, others, booking.getVoucher());
        if (totalPrice <= 0) {
            throw new IllegalArgumentException("Total price must be greater than 0");
        }
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.PENDING);

        // ==== VNPay xử lý ====
        String vnpTxnRef = null;
        if ("VNPAY".equalsIgnoreCase(String.valueOf(request.getPaymentMethod()))) {
            vnpTxnRef = VNPayConfig.getRandomNumber(8);
            booking.setVnpTxnRef(vnpTxnRef);
        }

        Booking savedBooking = bookingRepository.save(booking);

        // ==== Cập nhật trạng thái ghế ====
        for (SeatRoom seatRoom : seatRooms) {
            SeatBooked seatBooked = seatBookedRepository
                    .findByShowTimeIdAndSeatRoomId(showTime.getId(), seatRoom.getId())
                    .orElse(new SeatBooked());
            seatBooked.setSeatRoom(seatRoom);
            seatBooked.setShowTime(showTime);
            seatBooked.setStatus(SeatBooked.SeatRoomStatus.BOOKED);
            seatBookedRepository.save(seatBooked);
        }

        BookingDto bookingDto = new BookingDto(savedBooking);

        // ==== Tạo link thanh toán nếu VNPay ====
        if ("VNPAY".equalsIgnoreCase(String.valueOf(request.getPaymentMethod()))) {
            try {
                String orderInfo = "Thanh toan don hang #" + savedBooking.getId();
                String redirectUrl = vnPayService.createOrder(
                        totalPrice,
                        orderInfo,
                        vnPayConfig.getVnpReturnUrl(),
                        httpServletRequest
                );
                if (redirectUrl == null || redirectUrl.isEmpty()) {
                    throw new RuntimeException("Failed to generate VNPay payment URL");
                }
                bookingDto.setRedirectUrl(redirectUrl);
            } catch (Exception e) {
                bookingRepository.delete(savedBooking); // rollback
                throw new RuntimeException("Failed to generate VNPay payment URL: " + e.getMessage(), e);
            }
        }

        return bookingDto;
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
    @Transactional
    public BookingDto deleteBooking(int id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt vé"));
        bookingRepository.delete(booking);
        return new BookingDto(booking);
    }




}
