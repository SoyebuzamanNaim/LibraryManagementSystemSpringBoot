package bd.edu.seu.librarymanagementsystem.dto;

import java.time.LocalDateTime;

public record AllotmentResponseDTO(
        String id,
        String bookId,
        String bookTitle,
        String studentId,
        String studentName,
        String studentRoll,
        String allottedBy,
        String allottedByName,
        LocalDateTime allottedAt,
        LocalDateTime dueAt,
        LocalDateTime returnedAt,
        String status,
        Long fineAmount,
        Boolean isOverdue) {
}
