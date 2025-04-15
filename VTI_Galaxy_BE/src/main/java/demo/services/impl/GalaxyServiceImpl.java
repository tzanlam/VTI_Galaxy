package demo.services.impl;

import demo.modal.constant.OpenStatus;
import demo.modal.dto.GalaxyDto;
import demo.modal.entity.Galaxy;
import demo.modal.request.GalaxyRequest;
import demo.repository.GalaxyRepository;
import demo.services.interfaceClass.GalaxyService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GalaxyServiceImpl implements GalaxyService {
    private final GalaxyRepository galaxyRepository;

    public GalaxyServiceImpl(GalaxyRepository galaxyRepository) {
        this.galaxyRepository = galaxyRepository;
    }

    @Override
    public List<GalaxyDto> getGalaxies() {
        return galaxyRepository.findAll().stream().map(GalaxyDto::new).collect(Collectors.toList());
    }

    @Override
    public GalaxyDto getGalaxyById(int id) {
        Galaxy galaxy = galaxyRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Galaxy with id " + id + " not found")
        );
        return new GalaxyDto(galaxy);
    }

    @Override
    public GalaxyDto addGalaxy(GalaxyRequest request) throws Exception {
        Galaxy galaxy = request.addGalaxy();
        try{
            galaxyRepository.save(galaxy);
            return new GalaxyDto(galaxy);
        }catch (Exception e){
            throw new Exception("create new galaxy failed");
        }
    }

    @Override
    public GalaxyDto updateGalaxy(GalaxyRequest request, int id) {
        Galaxy galaxy = galaxyRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Galaxy with id " + id + " not found")
        );
        try {
            request.updateGalaxy(galaxy);
            galaxyRepository.save(galaxy);
            return new GalaxyDto(galaxy);
        }catch (Exception e){
            throw new RuntimeException("update galaxy failed");
        }
    }

    @Override
    public GalaxyDto closedGalaxy(int id) {
        Galaxy galaxy = galaxyRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Galaxy with id " + id + " not found")
        );
        galaxy.setStatus(OpenStatus.CLOSED);
        galaxyRepository.save(galaxy);
        return new GalaxyDto(galaxy);
    }
}
