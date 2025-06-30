package demo.modal.dto;

import demo.modal.entity.Voucher;
import lombok.Data;

@Data
public class VoucherDto {
    private int id;
    private String name;
    private int discount;
    private String startDate;
    private String  endDate;

    public VoucherDto(Voucher voucher){
        this.id = voucher.getId();
        this.name = voucher.getName();
        this.discount = voucher.getDiscount();
        this.startDate = voucher.getStartDate() != null ? voucher.getStartDate().toString() :  "not found";
        this.endDate = voucher.getEndDate() != null ? voucher.getEndDate().toString() :   "not found";
    }
}
