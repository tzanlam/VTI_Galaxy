package demo.modal.dto;

import demo.modal.entity.SeatRoom;
import lombok.Data;

@Data
public class SeatRoomDto {
    private int id;
    private int seatId;
    private int roomId;
    private String seatName;
    private String status;

    public SeatRoomDto(SeatRoom seatRoom) {
        this.id = seatRoom.getId();
        this.seatId = seatRoom.getSeat().getId();
        this.roomId = seatRoom.getRoom().getId();
        this.seatName = seatRoom.getName();
        this.status = seatRoom.getStatus() != null ? seatRoom.getStatus().toString() : null;
    }
}
