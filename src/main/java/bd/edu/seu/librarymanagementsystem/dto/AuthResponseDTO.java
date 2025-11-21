package bd.edu.seu.librarymanagementsystem.dto;

public record AuthResponseDTO(String token, UserDTO user, Boolean isFirstRun) {
}
