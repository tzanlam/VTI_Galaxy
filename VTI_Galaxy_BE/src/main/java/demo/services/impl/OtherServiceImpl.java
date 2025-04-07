package demo.services.impl;

import demo.modal.constant.ActiveStatus;
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
        return otherRepository.findAll().stream().map(OtherDto::new).collect(Collectors.toList());
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
        List<Other> others = galaxyRepository.findOthers(galaxyId).orElseThrow(
                () -> new IllegalArgumentException("not found")
        );
        return others.stream().map(OtherDto::new).collect(Collectors.toList());
    }

    @Override
    public OtherDto createNew(OtherRequest request) {
        try{
            Other other = request.setOther();
            otherRepository.save(other);
            return new OtherDto(other);
        }catch (Exception e){
            throw new IllegalArgumentException("create failed");
        }
    }

    @Override
    public OtherDto updateOtherById(OtherRequest request, int id) {
        Other other = otherRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("There is no other with this id")
        );
        try{
            request.updateOther(other);
            otherRepository.save(other);
            return new OtherDto(other);
        }catch (Exception e){
            throw new IllegalArgumentException("update failed");
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
