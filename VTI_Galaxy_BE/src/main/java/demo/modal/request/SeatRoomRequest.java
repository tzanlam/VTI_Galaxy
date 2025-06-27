package demo.modal.request;

import lombok.Data;

@Data
public class SeatRoomRequest {
    private int id;
    private int seatId;
    private int roomId;
    private int seatPerRow;
    private int quantityColumn;
}
