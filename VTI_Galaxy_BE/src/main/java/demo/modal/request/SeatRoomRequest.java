package demo.modal.request;

import demo.modal.entity.SeatRoom;
import lombok.Data;

@Data
public class SeatRoomRequest {
    private int seatId; // ID của ghế
    private int roomId; // ID của phòng chiếu
    private int showtimeId; // ID của suất chiếu
    private SeatRoom.BookedStatus status; // Trạng thái ghế: AVAILABLE, BOOKED, SELECTED
    private int seatPerRow;
    private int quantityColumn;


    public SeatRoom toSeatRoom() {
        SeatRoom seatRoom = new SeatRoom();
        seatRoom.setStatus(status != null ? status : SeatRoom.BookedStatus.AVAILABLE);
        return seatRoom;
    }
}
