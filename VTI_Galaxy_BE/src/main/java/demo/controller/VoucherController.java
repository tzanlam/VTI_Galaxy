package demo.controller;

import demo.modal.entity.Voucher;
import demo.modal.request.OtherRequest;
import demo.modal.request.VoucherRequest;
import demo.services.interfaceClass.VoucherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class VoucherController {
    private final VoucherService voucherService;

    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    @GetMapping("/getVouchers")
    public ResponseEntity<?> getVoucher() {
        try {
            return ResponseEntity.ok(voucherService.getAllVoucher());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getVoucherById")
    public ResponseEntity<?> getVoucherById(@RequestParam("voucherId") int id) {
        try {
            return ResponseEntity.ok(voucherService.getVoucherById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/postVoucher")
    public ResponseEntity<?> postVoucher(@RequestBody VoucherRequest request) {
        try {
            return ResponseEntity.ok(voucherService.createVoucher(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putVoucher")
    public ResponseEntity<?> putVoucher(@RequestBody VoucherRequest request, @RequestParam("voucherId") int voucherId) {
        try {
            return ResponseEntity.ok(voucherService.updateVoucher(request, voucherId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/deleteVoucher")
    public ResponseEntity<?> deleteVoucher(@RequestParam("voucherId") int voucherId) {
        try {
            return ResponseEntity.ok(voucherService.deleteVoucher(voucherId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
