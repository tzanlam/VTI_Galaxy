package demo.modal.request;

import demo.modal.constant.SeatType;
import demo.modal.entity.Seat;
import lombok.Data;

@Data
public class SeatRequest {
    private String name; // Tên ghế, ví dụ: "A1", "A2"
    private SeatType type; // Loại ghế: STANDARD, VIP, COUPLE
    private String description;
    private int price;
    private int roomId; // ID của phòng chứa ghế


    public Seat modal(Seat seat) {
        seat.setName(name);
        seat.setType(type);
        seat.setDescription(description);
        seat.setPrice(price);
        return seat;
    }
}