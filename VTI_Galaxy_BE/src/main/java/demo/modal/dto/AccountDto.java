package demo.modal.dto;

import demo.modal.entity.Account;
import lombok.Data;

@Data
public class AccountDto {
    private String accountId;
    private String email;
    private String password;
    private String fullName;
    private String avatar;
    private String dob;
    private String gender;
    private String position;
    private String status;
    private String phone;
    private String createdAt;
    private String updatedAt;

    public AccountDto(Account account) {
        this.accountId = String.valueOf(account.getId());
        this.fullName = account.getFullName() != null ? account.getFullName() : null;
        this.email = account.getEmail() != null ? account.getEmail() : null;
        this.phone = account.getPhoneNumber() != null ? account.getPhoneNumber() : null;
        this.dob = account.getDateOfBirth() != null ? String.valueOf(account.getDateOfBirth()) : null;
        this.avatar = account.getAvatar() != null ? account.getAvatar() : null;
        this.gender = account.getGender() != null ? account.getGender().toString() : null;
        this.status = account.getStatus() != null ? account.getStatus().toString() : null;
        this.position = account.getPosition() != null ? account.getPosition().toString() : null;
        this.createdAt = account.getCreated() != null ? account.getCreated().toString() : null;
        this.updatedAt = account.getModified() != null ? account.getModified().toString() : null;
    }
}
