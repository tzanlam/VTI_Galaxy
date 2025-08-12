package demo.modal.dto;

import demo.modal.entity.SeatBooked;
import lombok.Data;

@Data
public class SeatBookedDTO {
    private int id;
    private int seatRoomId;
    private String status;

    public SeatBookedDTO(SeatBooked seatBooked) {
        this.id = seatBooked.getId();
        this.seatRoomId = seatBooked.getSeatRoom().getId();
        this.status = seatBooked.getStatus().toString();
    }
}
