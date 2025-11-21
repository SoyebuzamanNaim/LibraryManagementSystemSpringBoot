package bd.edu.seu.librarymanagementsystem.dto;

public record StudentRequestDTO(
        String name,
        String roll,
        String email,
        String phone,
        String department,
        String subscriptionId) {
}
