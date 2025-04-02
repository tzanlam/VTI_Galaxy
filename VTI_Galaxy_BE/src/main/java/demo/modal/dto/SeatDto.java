package demo.modal.dto;

import demo.modal.entity.Seat;
import lombok.Data;

@Data
public class SeatDto {
    private int id;
    private String seatNameType;
    private String description;
    private int seatPrice;
    private String status;

    public SeatDto(Seat seat) {
        this.id = seat.getId();
        this.seatNameType = seat.getSeatNameType();
        this.description = seat.getDescription();
        this.seatPrice = seat.getPrice();
        this.status = seat.getStatus() != null ? seat.getStatus().toString() : null;
    }
}
