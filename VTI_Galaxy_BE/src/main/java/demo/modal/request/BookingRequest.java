package demo.modal.request;

import demo.modal.constant.BookingStatus;
import demo.modal.constant.PaymentMethod;
import demo.modal.entity.Booking;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {
    private String galaxyId;
    private List<String> seatRoomIds;
    private List<String> otherIds;
    private Long totalPrice;
    private String voucherId;
    private PaymentMethod paymentMethod;
    private BookingStatus status;


    }

