package demo.modal.request;

import demo.modal.constant.BookingStatus;
import demo.modal.constant.PaymentMethod;
import demo.modal.entity.Booking;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {
    private int id;
    @NotNull(message = "Người dùng không được để trống")
    private int accountId;
    @NotNull(message = "Suất chiếu không được để trống")
    private int showtimeId;
    @NotNull(message = "Mã rạp chiếu không được để trống")
    private int galaxyId;
    @NotNull(message = "Danh sách ghế không được để trống")
    private List<String> seatRoomIds;
    private List<String> otherIds;
    private int voucherId;
    private BookingStatus status;
    @NotNull(message = "Phương thức thanh toán không được để trống")
    private PaymentMethod paymentMethod;

    public void updateBooking(Booking booking) {
        if (this.status != null) {
            booking.setStatus(this.status);
        }
        if(this.paymentMethod != null){
            booking.setPaymentMethod(this.paymentMethod);
        }
    }
}

