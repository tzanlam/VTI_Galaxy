package demo.services.interfaceClass;

import demo.modal.dto.RoomDto;
import demo.modal.dto.VoucherDto;
import demo.modal.entity.Voucher;
import demo.modal.request.VoucherRequest;

import java.util.List;

public interface VoucherService {
    List<VoucherDto> getAllVoucher();
    VoucherDto getVoucherById(int id);

    VoucherDto createVoucher(VoucherRequest request);

    VoucherDto updateVoucher(VoucherRequest request, int id);

    VoucherDto deleteVoucher(int id);

}
