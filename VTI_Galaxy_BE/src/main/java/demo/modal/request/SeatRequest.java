package demo.modal.request;

import demo.modal.entity.Seat;
import lombok.Data;

@Data
public class SeatRequest {
    private String name;
    private int price;


    public Seat modal(Seat seat) {
        seat.setName(name);
        seat.setPrice(price);
        return seat;
    }
}