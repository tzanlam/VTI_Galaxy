package demo.services.impl;

import demo.modal.constant.ActiveStatus;
import demo.modal.constant.OtherStatus;
import demo.modal.dto.OtherDto;
import demo.modal.entity.Other;
import demo.modal.request.OtherRequest;
import demo.repository.GalaxyRepository;
import demo.repository.OtherRepository;
import demo.services.interfaceClass.OtherService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OtherServiceImpl implements OtherService {
    private final OtherRepository otherRepository;
    private final GalaxyRepository galaxyRepository;

    public OtherServiceImpl(OtherRepository otherRepository, GalaxyRepository galaxyRepository) {
        this.otherRepository = otherRepository;
        this.galaxyRepository = galaxyRepository;
    }

    @Override
    public List<OtherDto> getAllOthers() {
        return otherRepository.findAll().stream()
                .filter(other -> other.getStatus() == ActiveStatus.ACTIVE && other.getOtherStatus() == OtherStatus.ACTIVE)
                .map(OtherDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public OtherDto getOtherById(int id) {
        Other other = otherRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("There is no other with this id")
        );
        return new OtherDto(other);
    }

    @Override
    public List<OtherDto> getOtherByGalaxyId(int galaxyId) {
        List<Other> others = galaxyRepository.findOthers(galaxyId)
                .orElseThrow(() -> new IllegalArgumentException("No active combos found for Galaxy ID: " + galaxyId));
        return others.stream().map(OtherDto::new).collect(Collectors.toList());
    }

    @Override
    public OtherDto createNew(OtherRequest request) {
        try {
            Other other = request.setOther();
            other.setStatus(ActiveStatus.ACTIVE);
            other.setOtherStatus(OtherStatus.ACTIVE);
            other.setGalaxy(galaxyRepository.findById(request.getGalaxyId()).orElseThrow(
                    () -> new IllegalArgumentException("Invalid Galaxy ID: " + request.getGalaxyId())
            ));
            otherRepository.save(other);
            return new OtherDto(other);
        } catch (Exception e) {
            throw new IllegalArgumentException("Create failed: " + e.getMessage());
        }
    }

    @Override
    public OtherDto updateOtherById(OtherRequest request, int id) {
        Other other = otherRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("There is no other with this id")
        );
        try{
            request.updateOther(other);
            other.setGalaxy(galaxyRepository.findById(request.getGalaxyId()).orElseThrow(
                    () -> new IllegalArgumentException("Invalid Galaxy ID: " + request.getGalaxyId())
            ));
            otherRepository.save(other);
            return new OtherDto(other);
        }catch (Exception e){
            throw new IllegalArgumentException("Update failed: " + e.getMessage());
        }
    }

    @Override
    public OtherDto deleteOtherById(int id) {
        Other other = otherRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("There is no other with this id")
        );
        try{
            other.setStatus(ActiveStatus.DELETED);
            otherRepository.save(other);
            return new OtherDto(other);
        }catch (Exception e){
            throw new IllegalArgumentException("delete failed");
        }
    }
}
