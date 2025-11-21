package bd.edu.seu.librarymanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionRequestDTO {
    private String studentId;
    private String type;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean active;
}
