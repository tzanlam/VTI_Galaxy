package demo.controller;

import demo.modal.request.EmployeeRequest;
import demo.services.interfaceClass.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class EmployeeController {
    public final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/getEmployees")
    public ResponseEntity<?> findAllEmployees() {
        try{
            return ResponseEntity.ok(employeeService.getAllEmployees());
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getEmployeeById")
    public ResponseEntity<?> findEmployeeById(@RequestParam("employeeId") int id) {
        try{
            return ResponseEntity.ok(employeeService.getEmployeeById(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getEmployeeByGalaxyId")
    public ResponseEntity<?> findEmployeeByGalaxyId(@RequestParam("galaxyId") int id) {
        try{
            return ResponseEntity.ok(employeeService.getByGalaxyId(id));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/postEmployee")
    public ResponseEntity<?> postEmp(@RequestBody EmployeeRequest request){
        try{
            return ResponseEntity.ok(employeeService.createEmployee(request));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putEmployee")
    public ResponseEntity<?> putEmp(@RequestBody EmployeeRequest request, @RequestParam("employeeId") int employeeId){
        try{
            return ResponseEntity.ok(employeeService.updateEmployee(request, employeeId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/deleteEmployee")
    public ResponseEntity<?> deleteEmp(@RequestParam("employeeId")int employeeId){
        try{
            return ResponseEntity.ok(employeeService.deleteEmployee(employeeId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
