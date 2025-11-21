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
public class Student {

    private String id;
    private String name;
    private String roll;
    private String email;
    private String phone;
    private String department;
    private String subscriptionId;
    private LocalDate createdAt;

    public void setCreatedAtIfNull() {
        if (createdAt == null) {
            createdAt = LocalDate.now();
        }
    }
}
