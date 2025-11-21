package bd.edu.seu.librarymanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AllotmentResponseDTO {
    private String id;
    private String bookId;
    private String bookTitle;
    private String studentId;
    private String studentName;
    private String studentRoll;
    private String allottedBy;
    private String allottedByName;
    private LocalDateTime allottedAt;
    private LocalDateTime dueAt;
    private LocalDateTime returnedAt;
    private String status;
    private BigDecimal fineAmount;
    private Boolean isOverdue;
}
