package demo.modal.request;

import demo.modal.constant.OpenStatus;
import demo.modal.entity.Room;
import lombok.Data;

@Data
public class RoomRequest {
    private String name;
    private String typeScreen;
    private OpenStatus status;
    private int capacity;

    public Room addRoom(){
        Room room = new Room();
        room.setName(name);
        room.setTypeScreen(typeScreen);
        room.setStatus(status != null ? status : OpenStatus.CLOSED);
        room.setCapacity(capacity);
        return room;
    }

    public void updateRoom(Room room){
        room.setName(name);
        room.setTypeScreen(typeScreen);
        room.setStatus(status != null ? status : room.getStatus());
        room.setCapacity(capacity);
    }
}
