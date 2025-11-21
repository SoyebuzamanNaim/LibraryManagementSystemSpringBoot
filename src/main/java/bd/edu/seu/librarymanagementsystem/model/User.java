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
public class User {

    private String id;
    private String username;
    private String password;
    private String email;
    private String role;
    private LocalDate createdAt;

    public void setCreatedAtIfNull() {
        if (createdAt == null) {
            createdAt = LocalDate.now();
        }
    }

    public void setRoleIfNull() {
        if (role == null) {
            role = "user";
        }
    }
}
