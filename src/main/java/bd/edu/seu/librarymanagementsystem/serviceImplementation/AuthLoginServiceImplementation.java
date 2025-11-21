package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.service.AuthLoginService;
import bd.edu.seu.librarymanagementsystem.service.AuthSignInService;
import org.springframework.stereotype.Service;

@Service
public class AuthLoginServiceImplementation implements AuthLoginService {

    private final AuthSignInService authSignInService;

    public AuthLoginServiceImplementation(AuthSignInService authSignInService) {
        this.authSignInService = authSignInService;
    }

    @Override
    public boolean validateUser(String email, String password) {
        if (email == null || email.trim().isEmpty()
                || password == null || password.trim().isEmpty()) {
            return false;
        }

        return authSignInService.getAllUsers()
                .stream()
                .anyMatch(user -> email.equalsIgnoreCase(user.getEmail())
                        && password.equals(user.getPassword()));
    }
}
