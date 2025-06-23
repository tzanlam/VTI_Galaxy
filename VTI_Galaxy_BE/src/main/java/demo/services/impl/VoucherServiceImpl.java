package demo.services.impl;

import demo.modal.dto.RoomDto;
import demo.modal.dto.VoucherDto;
import demo.modal.entity.Room;
import demo.modal.entity.Voucher;
import demo.modal.request.VoucherRequest;
import demo.repository.VoucherRepository;
import demo.services.interfaceClass.VoucherService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VoucherServiceImpl implements VoucherService {
    private final VoucherRepository voucherRepository;

    public VoucherServiceImpl(VoucherRepository voucherRepository) {
        this.voucherRepository = voucherRepository;
    }
    @Override
    public List<VoucherDto> getAllVoucher(){
        return voucherRepository.findAll().stream()
                .map(VoucherDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public VoucherDto getVoucherById(int id) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Room not found with id: " + id)
        );
        return new VoucherDto(voucher);
    }

    @Override
    public VoucherDto createVoucher(VoucherRequest request) {
        Voucher voucher = new Voucher();
        try{
            voucherRepository.save(voucher);
            return new VoucherDto(voucher);
        }catch(Exception e){
            throw new RuntimeException("Tao voucher that bai");
        }
    }

    @Override
    public VoucherDto updateVoucher(VoucherRequest request, int id) {
        Voucher voucher = voucherRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Voucher not found with id: " + id)
        );
        try{
            request.updateVoucher(voucher);
            voucherRepository.save(voucher);
            return new VoucherDto(voucher);
        }catch(Exception e){
            throw new RuntimeException("Voucher update failed");
        }

    }

    @Override
    public VoucherDto deleteVoucher(int id) {
        return null;
    }
}
