package demo.modal.dto;

import demo.modal.entity.Seat;
import lombok.Data;

@Data
public class SeatDto {
    private String id;
    private String name;
    private String price;

    public SeatDto(Seat seat) {
        this.id = String.valueOf(seat.getId());
        this.name = seat.getName();
        this.price = String.valueOf(seat.getPrice());
    }
}
