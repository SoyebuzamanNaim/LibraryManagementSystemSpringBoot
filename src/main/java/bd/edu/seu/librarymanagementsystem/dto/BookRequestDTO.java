package bd.edu.seu.librarymanagementsystem.dto;

import java.time.LocalDate;
import java.util.List;

public record BookRequestDTO(
        String title,
        List<String> authors,
        String publicationId,
        String vendorId,
        String isbn,
        Integer totalCopies,
        Integer availableCopies,
        List<String> categories,
        LocalDate purchaseDate,
        Integer price) {
}
