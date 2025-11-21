package bd.edu.seu.librarymanagementsystem.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    private String id;
    private String title;
    private List<String> authors = new ArrayList<>();
    private String publicationId;
    private String vendorId;
    private String isbn;
    private Integer totalCopies;
    private Integer availableCopies;
    private List<String> categories = new ArrayList<>();
    private LocalDate purchaseDate;
    private Integer price;
    private LocalDate createdAt;

    public void setCreatedAtIfNull() {
        if (createdAt == null) {
            createdAt = LocalDate.now();
        }
    }
}
