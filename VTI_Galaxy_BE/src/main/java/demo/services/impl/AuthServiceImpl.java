package demo.services.impl;

import demo.config.jwt.JwtTokenUtil;
import demo.modal.dto.AuthResponse;
import demo.modal.entity.Account;
import demo.repository.AccountRepository;
import demo.services.interfaceClass.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserDetailsService userDetailsService;
    private final AccountRepository accountRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthServiceImpl(UserDetailsService userDetailsService, AccountRepository accountRepository, AuthenticationManager authenticationManager, JwtTokenUtil jwtTokenUtil) {
        this.userDetailsService = userDetailsService;
        this.accountRepository = accountRepository;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public AuthResponse login(String username, String password) {
        Account account = accountRepository.findByEmail(username).orElseThrow(
                () -> new RuntimeException("Account not found")
        );
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String token = jwtTokenUtil.generateToken(userDetails);
        return new AuthResponse(account.getId(), token, account.getEmail(), account.getAvatar(), userDetails.getAuthorities());
    }
}
