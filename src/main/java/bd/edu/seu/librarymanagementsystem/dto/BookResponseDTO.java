package bd.edu.seu.librarymanagementsystem.dto;

import java.time.LocalDate;
import java.util.List;

public record BookResponseDTO(
        String id,
        String title,
        List<String> authors,
        String publicationId,
        String publicationName,
        String vendorId,
        String vendorName,
        String isbn,
        Integer totalCopies,
        Integer availableCopies,
        List<String> categories,
        LocalDate purchaseDate,
        Integer price,
        LocalDate createdAt) {
}
