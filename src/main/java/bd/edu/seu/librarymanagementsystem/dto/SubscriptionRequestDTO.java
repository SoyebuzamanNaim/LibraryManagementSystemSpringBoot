package bd.edu.seu.librarymanagementsystem.dto;

import java.time.LocalDate;

public record SubscriptionRequestDTO(
        String studentId,
        String type,
        LocalDate startDate,
        LocalDate endDate,
        Boolean active) {
}
