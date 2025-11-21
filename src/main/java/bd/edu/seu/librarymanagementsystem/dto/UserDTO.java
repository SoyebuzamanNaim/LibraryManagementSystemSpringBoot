package bd.edu.seu.librarymanagementsystem.dto;

import java.time.LocalDate;

public record UserDTO(String id, String username, String email, String role, LocalDate createdAt) {
}
