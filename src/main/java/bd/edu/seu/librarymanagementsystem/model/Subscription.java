package bd.edu.seu.librarymanagementsystem.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    private String id;
    private String studentId;
    private String type;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean active;
}
