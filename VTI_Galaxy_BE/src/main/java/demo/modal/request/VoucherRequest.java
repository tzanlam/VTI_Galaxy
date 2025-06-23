package demo.modal.request;

import demo.modal.entity.Voucher;
import lombok.Data;

import java.time.LocalDateTime;

@Data

public class VoucherRequest {
    private String voucherName;
    private int discount;
    private LocalDateTime start_date;
    private LocalDateTime end_date;

   public Voucher setVoucher(){
       Voucher voucher = new Voucher();
       voucher.setVoucherName(voucherName);
       voucher.setDiscount(discount);
       voucher.setStart_date(start_date);
       voucher.setEnd_date(end_date);
       return voucher;
   }
   public void updateVoucher(Voucher voucher){
       voucher.setVoucherName(voucherName);
       voucher.setDiscount(discount);
       voucher.setStart_date(start_date);
       voucher.setEnd_date(end_date);

   }

}
