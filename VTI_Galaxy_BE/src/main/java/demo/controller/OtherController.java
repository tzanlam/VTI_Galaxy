package demo.controller;

import demo.modal.request.OtherRequest;
import demo.services.interfaceClass.OtherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class OtherController {
    private final OtherService otherService;

    public OtherController(OtherService otherService) {
        this.otherService = otherService;
    }

    @GetMapping("/getOthers")
    public ResponseEntity<?> getOthers() {
        try{
            return ResponseEntity.ok(otherService.getAllOthers());
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getOtherById")
    public ResponseEntity<?> getOtherById(@RequestParam("otherId") int id) {
        try{
            return ResponseEntity.ok(otherService.getOtherById(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getOtherByGalaxyId")
    public ResponseEntity<?> get(@RequestParam("galaxyId") int galaxyId) {
        try {
            return ResponseEntity.ok(otherService.getOtherByGalaxyId(galaxyId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/postOther")
    public ResponseEntity<?> postOther(@RequestBody OtherRequest request){
        try{
            return ResponseEntity.ok(otherService.createNew(request));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putOther")
    public ResponseEntity<?> putOther(@RequestBody OtherRequest request, @RequestParam("otherId") int otherId){
        try{
            return ResponseEntity.ok(otherService.updateOtherById(request,otherId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/deleteOther")
    public ResponseEntity<?> deleteOther(@RequestParam("otherId") int otherId){
        try{
            return ResponseEntity.ok(otherService.deleteOtherById(otherId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
