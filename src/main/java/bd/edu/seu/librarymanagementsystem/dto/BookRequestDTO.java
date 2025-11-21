package bd.edu.seu.librarymanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookRequestDTO {
    private String title;
    private List<String> authors;
    private String publicationId;
    private String vendorId;
    private String isbn;
    private Integer totalCopies;
    private Integer availableCopies;
    private List<String> categories;
    private LocalDate purchaseDate;
    private Integer price;
}
