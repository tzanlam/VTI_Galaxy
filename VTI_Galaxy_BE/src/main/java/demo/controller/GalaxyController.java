package demo.controller;

import demo.modal.request.GalaxyRequest;
import demo.services.interfaceClass.GalaxyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class GalaxyController {
    private final GalaxyService galaxyService;

    public GalaxyController(GalaxyService galaxyService) {
        this.galaxyService = galaxyService;
    }

    @GetMapping("/getGalaxies")
    public ResponseEntity<?> GetGalaxies() {
        try{
            return ResponseEntity.ok(galaxyService.getGalaxies());
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getGalaxyById")
    public ResponseEntity<?> GetGalaxyById(@RequestParam("galaxyId") int id) {
        try{
            return ResponseEntity.ok(galaxyService.getGalaxyById(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/postGalaxy")
    public ResponseEntity<?> createGalaxy(@RequestBody GalaxyRequest request) {
        try{
            return ResponseEntity.ok(galaxyService.addGalaxy(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putGalaxy")
    public ResponseEntity<?> updateGalaxy(@RequestBody GalaxyRequest request, @RequestParam("galaxyId") int id) {
        try{
            return ResponseEntity.ok(galaxyService.updateGalaxy(request, id));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/statusGalaxy")
    public ResponseEntity<?> closeGalaxy(@RequestParam("galaxyId") int id) {
        try{
            return ResponseEntity.ok(galaxyService.closedGalaxy(id));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
