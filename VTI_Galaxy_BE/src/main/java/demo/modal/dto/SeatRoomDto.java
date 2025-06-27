package demo.modal.dto;

import demo.modal.entity.SeatRoom;
import lombok.Data;

@Data
public class SeatRoomDto {
    private String id;
    private String name;
    private String type;
    private int price;
    private String roomId;
    private String status;

    public SeatRoomDto(SeatRoom seatRoom) {
        this.id = String.valueOf(seatRoom.getId());
        this.name = seatRoom.getName();
        this.type = seatRoom.getSeat().getName();
        this.price = seatRoom.getSeat().getPrice();
        this.roomId = String.valueOf(seatRoom.getRoom().getId());
        this.status = seatRoom.getStatus() != null ? seatRoom.getStatus().toString() : null;
    }
}
