package demo.modal.request;

import demo.modal.constant.OpenStatus;
import demo.modal.entity.Seat;
import lombok.Data;

@Data
public class SeatRequest {
    private String seatNameType;
    private String description;
    private int price;

    public Seat modal(Seat seat) {
        seat.setSeatNameType(seatNameType);
        seat.setDescription(description);
        seat.setPrice(price);
        seat.setStatus(OpenStatus.CLOSED);
        return seat;
    }
}
