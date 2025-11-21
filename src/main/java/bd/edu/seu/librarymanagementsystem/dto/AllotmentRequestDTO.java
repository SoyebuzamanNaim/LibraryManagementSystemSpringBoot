package bd.edu.seu.librarymanagementsystem.dto;

import java.time.LocalDateTime;

public record AllotmentRequestDTO(String bookId, String studentId, LocalDateTime dueAt) {

}
