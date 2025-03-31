package demo.modal.request;

import demo.modal.constant.ActiveStatus;
import demo.modal.entity.Account;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import static demo.support.MethodSupport.*;

@Data
public class AccountRequest {
    private String fullName;
    private String phoneNumber;
    private MultipartFile fileAvatar;
    private String email;
    private String password;
    private String dateOfBirth;
    private String gender;

    public Account adminAccount(){
        Account adminAccount = new Account();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        adminAccount.setFullName(fullName);
        adminAccount.setPhoneNumber(phoneNumber);
        adminAccount.setEmail(email);
        adminAccount.setPassword(passwordEncoder.encode(password));
        adminAccount.setPosition(Account.Position.ADMIN);
        adminAccount.setConfirmCode(randomConfirmationCode());
        adminAccount.setGender(convertStringToEnum(Account.Gender.class, gender));
        adminAccount.setStatus(ActiveStatus.INACTIVE);
        return adminAccount;
    }

    public Account userAccount(){
        Account userAccount = new Account();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        userAccount.setFullName(fullName);
        userAccount.setPhoneNumber(phoneNumber);
        userAccount.setEmail(email);
        userAccount.setPassword(passwordEncoder.encode(password));
        userAccount.setPosition(Account.Position.USER);
        userAccount.setConfirmCode(randomConfirmationCode());
        userAccount.setGender(convertStringToEnum(Account.Gender.class, gender));
        userAccount.setStatus(ActiveStatus.INACTIVE);
        return userAccount;
    }

    public void updateAccount(Account account) throws Exception {
        account.setFullName(fullName);
        account.setPhoneNumber(phoneNumber);
        account.setDateOfBirth(convertToLocalDate(dateOfBirth));
        account.setGender(convertStringToEnum(Account.Gender.class, gender));
    }
}
