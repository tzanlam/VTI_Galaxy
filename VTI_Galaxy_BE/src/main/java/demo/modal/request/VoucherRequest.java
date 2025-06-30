package demo.modal.request;

import demo.modal.entity.Voucher;
import lombok.Data;


import static demo.support.MethodSupport.buildLocalDateTime;

@Data

public class VoucherRequest {
    private String voucherName;
    private int discount;
    private String startDate;
    private String  endDate;

   public Voucher setVoucher(){
       Voucher voucher = new Voucher();
       voucher.setName(voucherName);
       voucher.setDiscount(discount);
       voucher.setStartDate(buildLocalDateTime(startDate, "00:00"));
       voucher.setEndDate(buildLocalDateTime(endDate, "23:59"));
       return voucher;
   }
   public void updateVoucher(Voucher voucher){
       voucher.setName(voucherName);
       voucher.setDiscount(discount);
       voucher.setStartDate(buildLocalDateTime(startDate, "00:00"));
       voucher.setEndDate(buildLocalDateTime(endDate, "23:59"));

   }

}
