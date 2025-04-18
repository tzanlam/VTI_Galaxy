package demo.services.impl;


import demo.config.mail.MailService;
import demo.modal.constant.ActiveStatus;
import demo.modal.dto.AccountDto;
import demo.modal.entity.Account;
import demo.modal.request.AccountRequest;
import demo.repository.AccountRepository;
import demo.services.interfaceClass.AccountService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static demo.support.MethodSupport.randomConfirmationCode;

@Service
public class AccountServiceImpl implements AccountService {
    @Value("${spring.mail.username}")
    private String mailAdmin;
    private final AccountRepository accountRepository;
    private final MailService mailSender;
    private final PasswordEncoder passwordEncoder;

    public AccountServiceImpl(AccountRepository accountRepository, MailService  mailSender, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
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
            account.setConfirmCode(randomConfirmationCode());
            accountRepository.save(account);
            mailSender.sendMail(
                    request.getEmail(),
                    mailAdmin,
                    "Xác nhận tạo tài khoản",
                    "Mã xác nhận tài khoản của bạn là:"+account.getConfirmCode() );
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
        try{
            account.setPassword(passwordEncoder.encode(password));
            accountRepository.save(account);
            mailSender.sendMail(
                    account.getEmail(),
                    mailAdmin,
                    "Mật khẩu mới của bạn",
                    "mật khẩu mới của bạn là: "+ account.getPassword()
            );
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
