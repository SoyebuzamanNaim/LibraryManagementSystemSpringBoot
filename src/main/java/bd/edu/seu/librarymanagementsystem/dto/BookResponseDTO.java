package bd.edu.seu.librarymanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookResponseDTO {
    private String id;
    private String title;
    private List<String> authors;
    private String publicationId;
    private String publicationName;
    private String vendorId;
    private String vendorName;
    private String isbn;
    private Integer totalCopies;
    private Integer availableCopies;
    private List<String> categories;
    private LocalDate purchaseDate;
    private Integer price;
    private LocalDate createdAt;
}
