package demo.modal.request;

import demo.modal.constant.BookingStatus;
import demo.modal.constant.PaymentMethod;
import demo.modal.entity.Booking;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {
    private int id;
    @NotNull(message = "Người dùng không được để trống")
    private int accountId;
    @NotNull(message = "Mã rạp chiếu không được để trống")
    private int galaxyId;
    @NotNull(message = "Danh sách ghế không được để trống")
    private List<String> seatRoomIds;
    private List<String> otherIds;
    private int voucherId;
//    @NotNull(message = "Phương thức thanh toán không được để trống")
//    private PaymentMethod paymentMethod; => thuong thi dat ve xong ra so tien roi moi den buoc thanh toan tuc la trang thai pending khi thanh toan truoc thi => booked
    private BookingStatus status;

    public Booking setBooking(){
        Booking booking = new Booking();
//        booking.setPaymentMethod(this.paymentMethod);
        booking.setStatus(BookingStatus.PENDING);
        return booking;
    }

    public void updateBooking(Booking booking) {

//        if (this.paymentMethod != null) {
//            booking.setPaymentMethod(this.paymentMethod);
//        }
        if (this.status != null) {
            booking.setStatus(this.status);
        }
    }
}

