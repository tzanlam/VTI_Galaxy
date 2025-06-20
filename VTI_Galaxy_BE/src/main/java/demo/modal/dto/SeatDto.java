package demo.modal.dto;

import demo.modal.entity.Seat;
import lombok.Data;

@Data
public class SeatDto {
    private String id; // Đồng bộ với Long trong entity Seat
    private String name; // Tên ghế, ví dụ: "A1", "A2"
    private String type; // Loại ghế: STANDARD, VIP, COUPLE
    private String price; // Giá ghế
    private String roomId; // ID của phòng chứa ghế

    public SeatDto(Seat seat) {
        this.id = String.valueOf(seat.getId());
        this.name = seat.getName();
        this.type = seat.getType() != null ? seat.getType().toString() : null;
        this.price = String.valueOf(seat.getPrice());
        this.roomId = String.valueOf(seat.getRoom() != null ? seat.getRoom().getId() : null);
    }
}
