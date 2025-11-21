package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.dto.AuthResponseDTO;
import bd.edu.seu.librarymanagementsystem.dto.LoginRequestDTO;
import bd.edu.seu.librarymanagementsystem.service.AuthService;

public class AuthServiceImpl implements AuthService {

    @Override
    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        return null;
    }

    @Override
    public boolean validateSession(String token) {
        return false;
    }

    @Override
    public String getUsernameFromToken(String token) {
        return "";
    }

    @Override
    public void logout(String token) {

    }

    @Override
    public boolean isFirstRun() {
        return false;
    }
}
