package demo.services.impl;

import demo.modal.entity.Account;
import demo.repository.AccountRepository;
import demo.services.interfaceClass.SupportService;
import org.springframework.stereotype.Service;

@Service
public class SupportServiceImpl implements SupportService {
    private final AccountRepository accountRepository;

    public SupportServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public boolean checkCode(int accountId, String code) {
        Account account = accountRepository.findById(accountId).orElseThrow(
                () -> new RuntimeException("Account not found")
        );
        try{
            if (account.getConfirmCode().equals(code)) {
                account.setConfirmCode(null);
                return true;
            }
            return false;
        }catch (RuntimeException e){
            throw new RuntimeException("Something went wrong");
        }
    }
}
