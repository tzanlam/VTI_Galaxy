package demo.services.impl;

import demo.config.VNPay.VNPayConfig;
import demo.modal.constant.BookingStatus;
import demo.modal.dto.BookingDto;
import demo.modal.entity.Booking;
import demo.modal.entity.Other;
import demo.modal.entity.SeatRoom;
import demo.modal.request.BookingRequest;
import demo.repository.*;
import demo.services.VNPayService;
import demo.services.interfaceClass.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
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

    public BookingServiceImpl(BookingRepository bookingRepository, ShowTimeRepository showTimeRepository, GalaxyRepository galaxyRepository, VoucherRepository voucherRepository, SeatRoomRepository seatRoomRepository, OtherRepository otherRepository, AccountRepository accountRepository, VNPayService vnPayService, HttpServletRequest httpServletRequest, VNPayConfig vnPayConfig) {
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
    public BookingDto createBooking(BookingRequest request) {
        System.out.println("Creating booking with request: " + request);
        try {
            // Validate request
            if (request.getAccountId() <= 0 || request.getGalaxyId() <= 0 ||
                    request.getShowtimeId() <= 0 || request.getSeatRoomIds() == null ||
                    request.getSeatRoomIds().isEmpty()) {
                System.err.println("Invalid booking request: " + request);
                throw new IllegalArgumentException("Missing required fields in booking request");
            }

            Booking booking = new Booking();
            booking.setPaymentMethod(request.getPaymentMethod());
            voucherRepository.findById(request.getVoucherId()).ifPresentOrElse(
                    booking::setVoucher,
                    () -> booking.setVoucher(null)
            );

            booking.setAccount(accountRepository.findById(request.getAccountId())
                    .orElseThrow(() -> {
                        System.err.println("Account not found with id: " + request.getAccountId());
                        return new RuntimeException("Account not found");
                    }));

            booking.setShowTime(showTimeRepository.findById(request.getShowtimeId())
                    .orElseThrow(() -> {
                        System.err.println("Show time not found with id: " + request.getShowtimeId());
                        return new RuntimeException("Show time not found");
                    }));
            booking.setGalaxy(galaxyRepository.findById(request.getGalaxyId())
                    .orElseThrow(() -> {
                        System.err.println("Galaxy not found with id: " + request.getGalaxyId());
                        return new RuntimeException("Không tìm thấy rạp");
                    }));

            List<SeatRoom> seatRooms = new ArrayList<>();
            for (String i : request.getSeatRoomIds()) {
                SeatRoom seatRoom = seatRoomRepository.findById(Integer.parseInt(i)).orElseThrow(
                        () -> {
                            System.err.println("SeatRoom not found with id: " + i);
                            return new RuntimeException("Ghế không tồn tại");
                        }
                );
                // Validate seat status
                if (seatRoom.getStatus() == SeatRoom.BookedStatus.BOOKED) {
                    System.err.println("SeatRoom already booked: " + i);
                    throw new IllegalStateException("Seat " + seatRoom.getName() + " is already booked");
                }
                seatRooms.add(seatRoom);
            }
            booking.setSeatRooms(seatRooms);

            List<Other> others = new ArrayList<>();
            for (String j : request.getOtherIds()) {
                Other other = otherRepository.findById(Integer.parseInt(j)).orElseThrow(
                        () -> {
                            System.err.println("Other not found with id: " + j);
                            return new RuntimeException("Combo không tồn tại");
                        }
                );
                others.add(other);
            }
            booking.setOther(others);

            int totalPrice = calculatePriceBooking(booking.getSeatRooms(), booking.getOther(), booking.getVoucher());
            if (totalPrice <= 0) {
                System.err.println("Invalid totalPrice: " + totalPrice);
                throw new IllegalArgumentException("Total price must be greater than 0");
            }
            booking.setTotalPrice(totalPrice);
            booking.setStatus(BookingStatus.PENDING);

            String vnpTxnRef = null;
            if ("VNPAY".equalsIgnoreCase(String.valueOf(request.getPaymentMethod()))) {
                vnpTxnRef = VNPayConfig.getRandomNumber(8);
                booking.setVnpTxnRef(vnpTxnRef);
                System.out.println("Generated VNPay vnpTxnRef: " + vnpTxnRef);
            }

            // Save booking after setting all fields but before VNPay to allow rollback
            Booking savedBooking = bookingRepository.save(booking);
            System.out.println("Saved booking with id: " + savedBooking.getId());

            BookingDto bookingDto = new BookingDto(savedBooking);
            if ("VNPAY".equalsIgnoreCase(String.valueOf(request.getPaymentMethod()))) {
                try {
                    String ipAddress = VNPayConfig.getIpAddress(httpServletRequest);
                    String orderInfo = "Thanh toan don hang " + savedBooking.getId();
                    System.out.println("Calling VNPayService.createOrder with totalPrice=" + totalPrice +
                            ", orderInfo=" + orderInfo + ", ipAddress=" + ipAddress +
                            ", vnpTxnRef=" + vnpTxnRef);
                    String redirectUrl = vnPayService.createOrder(
                            totalPrice,
                            orderInfo,
                            vnPayConfig.getVnpReturnUrl(),
                            httpServletRequest
                    );
                    if (redirectUrl == null || redirectUrl.isEmpty()) {
                        System.err.println("VNPayService.createOrder returned null or empty URL");
                        throw new RuntimeException("Failed to generate VNPay payment URL");
                    }
                    System.out.println("Generated VNPay redirectUrl: " + redirectUrl);
                    bookingDto.setRedirectUrl(redirectUrl);
                } catch (Exception e) {
                    System.err.println("Error generating VNPay redirectUrl: " + e.getMessage());
                    // Rollback booking
                    bookingRepository.delete(savedBooking);
                    System.out.println("Rolled back booking with id: " + savedBooking.getId());
                    throw new RuntimeException("Failed to generate VNPay payment URL: " + e.getMessage(), e);
                }
            }

            return bookingDto;
        } catch (Exception e) {
            System.err.println("Booking creation failed: " + e.getMessage());
            throw new RuntimeException("Failed to create booking: " + e.getMessage(), e);
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
    @Transactional
    public BookingDto deleteBooking(int id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt vé"));
        bookingRepository.delete(booking);
        return new BookingDto(booking);
    }


}
