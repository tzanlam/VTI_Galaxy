package demo.modal.dto;

import demo.modal.entity.Room;
import lombok.Data;

@Data
public class RoomDto {
    private int id; // Đồng bộ với Long trong entity Room
    private String name;
    private String typeScreen;
    private String status;
    private String capacity;

    public RoomDto(Room room){
        this.id = room.getId();
        this.name = room.getName();
        this.typeScreen = room.getTypeScreen();
        this.status = room.getStatus() != null ? room.getStatus().toString() : null;
        this.capacity = String.valueOf(room.getCapacity());
    }
}