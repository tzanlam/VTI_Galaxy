package demo.services.interfaceClass;

import demo.modal.dto.OtherDto;
import demo.modal.request.OtherRequest;

import java.util.List;

public interface OtherService {
    // get
    List<OtherDto> getAllOthers();
    OtherDto getOtherById(int id);
    List<OtherDto> getOtherByGalaxyId(int galaxyId);

    // post
    OtherDto createNew(OtherRequest request);

    // put
    OtherDto updateOtherById(OtherRequest request, int id);

    // delete
    OtherDto deleteOtherById(int id);
}
