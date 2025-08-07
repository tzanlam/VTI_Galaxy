package demo.config.data;

import demo.modal.constant.ActiveStatus;
import demo.modal.entity.Account;
import demo.repository.AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class AccountSeeder {
    @Bean
    CommandLineRunner seedAccounts(AccountRepository accountRepo) {
        return args -> {
            if (accountRepo.count() == 0) {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

                Account admin1 = new Account();
                admin1.setFullName("Nguyễn Văn Admin1");
                admin1.setPhoneNumber("0901234567");
                admin1.setAvatar("#");
                admin1.setEmail("admin1@example.com");
                admin1.setPassword(encoder.encode("123456"));
                admin1.setDateOfBirth(LocalDate.of(1990, 1, 1));
                admin1.setPosition(Account.Position.ADMIN);
                admin1.setGender(Account.Gender.MALE);
                admin1.setStatus(ActiveStatus.ACTIVE);
                admin1.setPoint(1000);

                Account admin2 = new Account();
                admin2.setFullName("Trần Thị Admin2");
                admin2.setPhoneNumber("0912345678");
                admin2.setAvatar("#");
                admin2.setEmail("admin2@example.com");
                admin2.setPassword(encoder.encode("123456"));
                admin2.setDateOfBirth(LocalDate.of(1992, 3, 15));
                admin2.setPosition(Account.Position.ADMIN);
                admin2.setGender(Account.Gender.FEMALE);
                admin2.setStatus(ActiveStatus.ACTIVE);
                admin2.setPoint(800);

                Account user1 = new Account();
                user1.setFullName("Lê Văn User1");
                user1.setPhoneNumber("0923456789");
                user1.setAvatar("#");
                user1.setEmail("user1@example.com");
                user1.setPassword(encoder.encode("123456"));
                user1.setDateOfBirth(LocalDate.of(1995, 5, 10));
                user1.setPosition(Account.Position.USER);
                user1.setGender(Account.Gender.MALE);
                user1.setStatus(ActiveStatus.ACTIVE);
                user1.setPoint(200);

                Account user2 = new Account();
                user2.setFullName("Phạm Thị User2");
                user2.setPhoneNumber("0934567890");
                user2.setAvatar("#");
                user2.setEmail("user2@example.com");
                user2.setPassword(encoder.encode("123456"));
                user2.setDateOfBirth(LocalDate.of(1998, 8, 20));
                user2.setPosition(Account.Position.USER);
                user2.setGender(Account.Gender.FEMALE);
                user2.setStatus(ActiveStatus.ACTIVE);
                user2.setPoint(150);

                Account user3 = new Account();
                user3.setFullName("Hoàng Văn User3");
                user3.setPhoneNumber("0945678901");
                user3.setAvatar("#");
                user3.setEmail("user3@example.com");
                user3.setPassword(encoder.encode("123456"));
                user3.setDateOfBirth(LocalDate.of(2000, 12, 1));
                user3.setPosition(Account.Position.USER);
                user3.setGender(Account.Gender.MALE);
                user3.setStatus(ActiveStatus.ACTIVE);
                user3.setPoint(100);

                accountRepo.saveAll(List.of(admin1, admin2, user1, user2, user3));
                System.out.println("Seeded 5 Accounts (2 Admin, 3 User)");
            }
        };
    }
}
