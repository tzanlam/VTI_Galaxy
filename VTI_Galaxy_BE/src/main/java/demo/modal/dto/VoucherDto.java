package demo.modal.dto;

import demo.modal.entity.Voucher;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class VoucherDto {
    private int id;
    private String voucherName;
    private int discount;
    private LocalDateTime start_date;
    private LocalDateTime end_date;

    public VoucherDto(Voucher voucher){
        this.id = voucher.getId();
        this.voucherName = voucher.getVoucherName();
        this.discount = voucher.getDiscount();
        this.start_date = voucher.getStart_date();
        this.end_date = voucher.getEnd_date();

    }
}
