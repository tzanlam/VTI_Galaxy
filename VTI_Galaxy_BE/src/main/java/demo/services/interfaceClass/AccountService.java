package demo.services.interfaceClass;

import demo.modal.dto.AccountDto;
import demo.modal.request.AccountRequest;

import java.util.List;

public interface AccountService {
    // get
    List<AccountDto> getAccounts();
    AccountDto getAccountById(int id);

    // post
    AccountDto registerAdmin(AccountRequest request);
    AccountDto registerUser(AccountRequest request);

    //put
    AccountDto updateAccount(AccountRequest request, int id);
    AccountDto updateEmail(int id, String email);
    AccountDto updatePassword(int id, String password);

    // delete
    AccountDto deleteAccount(int id);
}
