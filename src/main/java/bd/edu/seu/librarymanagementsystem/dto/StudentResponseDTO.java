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
public class StudentResponseDTO {
    private String id;
    private String name;
    private String roll;
    private String email;
    private String phone;
    private String department;
    private String subscriptionId;
    private Boolean hasActiveSubscription;
    private LocalDate createdAt;
}
