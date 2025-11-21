package bd.edu.seu.librarymanagementsystem.service;

import bd.edu.seu.librarymanagementsystem.dto.AuthResponseDTO;
import bd.edu.seu.librarymanagementsystem.dto.LoginRequestDTO;

public interface AuthService {
    AuthResponseDTO login(LoginRequestDTO loginRequest);

    boolean validateSession(String token);

    String getUsernameFromToken(String token);

    void logout(String token);

    boolean isFirstRun();
}
