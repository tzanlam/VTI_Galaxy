package demo.modal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
@AllArgsConstructor
public class AuthResponse {
    private int accountId;
    private String token;
    private String identifier;
    private String image;
    private Collection<? extends GrantedAuthority> authorities;
}
