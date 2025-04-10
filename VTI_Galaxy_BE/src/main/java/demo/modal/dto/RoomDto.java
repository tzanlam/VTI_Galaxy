package demo.modal.dto;

import demo.modal.entity.Room;
import lombok.Data;

@Data
public class RoomDto {
    private int id;
    private String name;
    private String typeScreen;
    private String status;

    public RoomDto(Room room){
        this.id = room.getId();
        this.name = room.getName();
        this.typeScreen = room.getTypeScreen();
        this.status = room.getStatus() != null ? room.getStatus().toString() : null;
    }
}