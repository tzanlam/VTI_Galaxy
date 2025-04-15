package demo.services.UserDetailService;

import demo.modal.entity.Account;
import demo.services.impl.repository.AccountRepository;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {
    private final AccountRepository accountRepository;

    public CustomUserDetailService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account account = accountRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException(email)
        );
        return new User(email, account.getPassword(), AuthorityUtils.createAuthorityList(account.getPosition().name()));
    }
}
