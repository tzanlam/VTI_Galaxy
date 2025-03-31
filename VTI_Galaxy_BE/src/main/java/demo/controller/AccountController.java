package demo.controller;

import demo.modal.request.AccountRequest;
import demo.services.interfaceClass.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/getAccounts")
    public ResponseEntity<?> findAllAccounts() {
        try{
            return ResponseEntity.ok(accountService.getAccounts());
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getAccountById")
    public ResponseEntity<?> findAccountById(@RequestParam("accountId") int accountId) {
        try{
            return ResponseEntity.ok(accountService.getAccountById(accountId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/registerAdmin")
    public ResponseEntity<?> registerAdmin(@RequestBody AccountRequest request) {
        try{
            return ResponseEntity.ok(accountService.registerAdmin(request));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/registerUser")
    public ResponseEntity<?> registerUser(@RequestBody AccountRequest request) {
        try{
            return ResponseEntity.ok(accountService.registerUser(request));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putAccount")
    public ResponseEntity<?> putAccount(@RequestBody AccountRequest request, @RequestParam("accountId") int accountId) {
        try {
            return ResponseEntity.ok(accountService.updateAccount(request,accountId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putEmail")
    public ResponseEntity<?> putEmail(@RequestParam("accountId") int accountId, @RequestParam("email") String email) {
        try{
            return ResponseEntity.ok(accountService.updateEmail(accountId,email));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/putPassword")
    public ResponseEntity<?> putPassword(@RequestParam("accountId") int accountId, @RequestParam("password") String password) {
        try{
            return ResponseEntity.ok(accountService.updatePassword(accountId,password));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/deleteAccount")
    public ResponseEntity<?> deleteAccount(@RequestParam("accountId") int accountId) {
        try{
            return ResponseEntity.ok(accountService.deleteAccount(accountId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
