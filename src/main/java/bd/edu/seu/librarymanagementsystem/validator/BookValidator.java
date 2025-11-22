package bd.edu.seu.librarymanagementsystem.validator;

import bd.edu.seu.librarymanagementsystem.model.Book;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;

public class BookValidator {

    private BookValidator() {
    }

    public static void validate(Book book) {
        if (book == null) {
            throw new IllegalArgumentException("Book must not be null");
        }
        if (StringUtils.isBlank(book.getTitle())) {
            throw new IllegalArgumentException("Book title must not be blank");
        }
        if (book.getTotalCopies() != null && book.getTotalCopies() < 0) {
            throw new IllegalArgumentException("Total copies cannot be negative");
        }
        if (book.getAvailableCopies() != null && book.getAvailableCopies() < 0) {
            throw new IllegalArgumentException("Available copies cannot be negative");
        }
        if (book.getTotalCopies() != null && book.getAvailableCopies() != null
                && book.getAvailableCopies() > book.getTotalCopies()) {
            throw new IllegalArgumentException("Available copies cannot exceed total copies");
        }
        if (book.getPrice() != null && book.getPrice() < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
    }

    public static void validateId(String id) {
        if (StringUtils.isBlank(id)) {
            throw new IllegalArgumentException("Book ID must not be blank");
        }
    }
}
