package bd.edu.seu.librarymanagementsystem.dto;

import java.time.LocalDate;

public record StudentResponseDTO(
        String id,
        String name,
        String roll,
        String email,
        String phone,
        String department,
        String subscriptionId,
        Boolean hasActiveSubscription,
        LocalDate createdAt) {
}
