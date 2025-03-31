package demo.controller;

import demo.services.interfaceClass.SupportService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@CrossOrigin("*")
public class SupportController {
    private final SupportService supportService;
    public SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestParam int accountId, @RequestParam String code){
        try {
            return ResponseEntity.ok(supportService.checkCode(accountId, code));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = "/postImg", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postImg(MultipartFile file){
        try{
            return ResponseEntity.ok(supportService.upload(file));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
