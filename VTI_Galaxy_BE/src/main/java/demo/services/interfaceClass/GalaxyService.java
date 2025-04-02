package demo.services.interfaceClass;

import demo.modal.dto.GalaxyDto;
import demo.modal.request.GalaxyRequest;

import java.util.List;

public interface GalaxyService {
    // get
    List<GalaxyDto> getGalaxies();
    GalaxyDto getGalaxyById(int id);

    // post
    GalaxyDto addGalaxy(GalaxyRequest request) throws Exception;

    // put
    GalaxyDto updateGalaxy(GalaxyRequest request, int id);

    // delete(closed)
    GalaxyDto closedGalaxy(int id);
}
