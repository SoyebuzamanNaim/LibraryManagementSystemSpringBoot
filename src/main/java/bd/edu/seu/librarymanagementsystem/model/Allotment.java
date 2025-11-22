package bd.edu.seu.librarymanagementsystem.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Allotment {

    private String id;
    private String bookId;
    private String studentId;
    private String allottedBy;
    private LocalDateTime allottedAt;
    private LocalDateTime dueAt;
    private LocalDateTime returnedAt;
    private String status;
    private Long fineAmount;

    public void setAllottedAtIfNull() {
        if (allottedAt == null) {
            allottedAt = LocalDateTime.now();
        }
    }

    public void setStatusIfNull() {
        if (status == null) {
            status = "active";
        }
    }
}
