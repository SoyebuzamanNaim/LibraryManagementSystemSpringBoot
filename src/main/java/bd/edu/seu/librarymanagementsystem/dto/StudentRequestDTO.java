package bd.edu.seu.librarymanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequestDTO {
    private String name;
    private String roll;
    private String email;
    private String phone;
    private String department;
    private String subscriptionId;
}
