package demo.modal.request;

import lombok.Data;

@Data
public class SeatRoomRequest {
    private int id; // Note: May not be needed for creating multiple seats
    private int seatId;
    private int roomId;
    private int showtimeId; // Ensure this field is present
    private int seatPerRow;
    private int quantityColumn;
}