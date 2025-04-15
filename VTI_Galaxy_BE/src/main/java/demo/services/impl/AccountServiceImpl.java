package demo.services.impl;

import demo.modal.constant.ActiveStatus;
import demo.modal.dto.AccountDto;
import demo.modal.entity.Account;
import demo.modal.request.AccountRequest;
import demo.services.impl.repository.AccountRepository;
import demo.services.interfaceClass.AccountService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public List<AccountDto> getAccounts() {
        try {
            return accountRepository.findAll().stream()
                    .map(AccountDto::new)
                    .collect(Collectors.toList());
        }catch(Exception e) {
            throw new NullPointerException("Account not found");
        }
    }

    @Override
    public AccountDto getAccountById(int id) {
        Account account = accountRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Account not found")
        );
        return new AccountDto(account);
    }

    @Override
    public AccountDto registerAdmin(AccountRequest request) {
        try {
            Account account = request.adminAccount();
            accountRepository.save(account);
            return new AccountDto((account));
        }catch (Exception e) {
            throw new RuntimeException("Create account failed");
        }
    }

    @Override
    public AccountDto registerUser(AccountRequest request) {
        try{
            Account account = request.userAccount();
            accountRepository.save(account);
            return new AccountDto(account);
        }catch (Exception e) {
            throw new RuntimeException("Create account failed");
        }
    }

    @Override
    public AccountDto updateAccount(AccountRequest request, int id) {
        Account account = accountRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Account not found")
        );
        try{
            request.updateAccount(account);
            accountRepository.save(account);
            return new AccountDto(account);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public AccountDto updateEmail(int id, String email) {
        Account account = accountRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Account not found")
        );
        try{
            account.setEmail(email);
            accountRepository.save(account);
            return new AccountDto(account);
        }catch (Exception e) {
            throw new RuntimeException("Update email failed");
        }
    }

    @Override
    public AccountDto updatePassword(int id, String password) {
        Account account = accountRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Account not found")
        );
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        try{
            account.setPassword(encoder.encode(password));
            accountRepository.save(account);
            return new AccountDto(account);
        }catch (Exception e) {
            throw new RuntimeException("Update password failed");
        }
    }

    @Override
    public AccountDto deleteAccount(int id) {
        Account account = accountRepository.findById(id).orElseThrow(
                () -> new NullPointerException("Account not found")
        );
        try{
            account.setStatus(ActiveStatus.DELETED);
            accountRepository.save(account);
            return new AccountDto(account);
        }catch (Exception e) {
            throw new RuntimeException("Delete account failed");
        }
    }
}
