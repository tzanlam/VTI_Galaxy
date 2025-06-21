package demo.modal.dto;

import demo.modal.entity.Seat;
import demo.modal.entity.SeatRoom;
import lombok.Data;

@Data
public class SeatRoomDto {
    private String id; // Đồng bộ với Long trong entity SeatRoom
    private Seat seat;
    private String roomId; // ID của phòng chiếu
    private String showtimeId; // ID của suất chiếu
    private String status; // Trạng thái ghế: AVAILABLE, BOOKED, SELECTED

    public SeatRoomDto(SeatRoom seatRoom) {
        this.id = String.valueOf(seatRoom.getId());
        this.seat = seatRoom.getSeat();
        this.roomId = String.valueOf(seatRoom.getRoom().getId());
        this.showtimeId = String.valueOf(seatRoom.getShowTime().getId());
        this.status = seatRoom.getStatus() != null ? seatRoom.getStatus().toString() : null;
    }
}
