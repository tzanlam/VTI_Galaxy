package demo.modal.dto;

import demo.modal.constant.BookingStatus;
import demo.modal.constant.PaymentMethod;
import demo.modal.entity.Booking;
import lombok.Data;
import lombok.EqualsAndHashCode;
import net.minidev.json.annotate.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode
public class BookingDto {
    private int id;
    private String accountId;
    private String showtimeId;
    @JsonIgnore
    private List<String> seatRoomIds;
    @JsonIgnore
    private List<String> otherIds;
    private int totalPrice;
    private String galaxyId;
    private String voucherId;
    private PaymentMethod paymentMethod;
    private BookingStatus status;
    private String redirectUrl;

    public BookingDto(Booking booking) {
        this.id =  booking.getId();
        this.accountId = booking.getAccount() != null ? String.valueOf(booking.getAccount().getId()) : null;
        this.showtimeId = booking.getShowTime() != null ? String.valueOf(booking.getShowTime().getId()) : null;
        this.seatRoomIds = booking.getSeatRooms() != null ?
                booking.getSeatRooms().stream().map(sr -> String.valueOf(sr.getId())).toList() :
                new ArrayList<>();
        this.otherIds = booking.getOther() != null ?
                booking.getOther().stream().map(o -> String.valueOf(o.getId())).toList() :
                new ArrayList<>();
        this.totalPrice = booking.getTotalPrice();
        this.galaxyId = booking.getGalaxy() != null ? String.valueOf(booking.getGalaxy().getId()) : null;
        this.voucherId = booking.getVoucher() != null ? String.valueOf(booking.getVoucher().getId()) : null;
        this.paymentMethod = booking.getPaymentMethod();
        this.status = booking.getStatus();
        this.redirectUrl = null;
    }
}
