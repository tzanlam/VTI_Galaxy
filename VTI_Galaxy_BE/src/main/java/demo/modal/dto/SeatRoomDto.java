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

    public SeatRoomDto(SeatRoom seatRoom) {
        this.id = seatRoom.getId() != 0 ? String.valueOf(seatRoom.getId()) : null;
        this.name = seatRoom.getName();
        this.type = seatRoom.getSeat() != null ? seatRoom.getSeat().getName() : null;
        this.price = seatRoom.getSeat() != null ? seatRoom.getSeat().getPrice() : 0;
        this.roomId = seatRoom.getRoom() != null ? String.valueOf(seatRoom.getRoom().getId()) : null;
    }
}