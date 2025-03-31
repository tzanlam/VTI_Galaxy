package demo.services.interfaceClass;

import demo.modal.dto.AuthResponse;

public interface AuthService {
    AuthResponse login(String username, String password);
}
