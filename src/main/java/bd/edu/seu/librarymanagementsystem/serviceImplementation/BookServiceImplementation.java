package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.model.Book;
import bd.edu.seu.librarymanagementsystem.service.BookService;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;
import bd.edu.seu.librarymanagementsystem.validator.BookValidator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class BookServiceImplementation implements BookService {

    private final CopyOnWriteArrayList<Book> bookStore = new CopyOnWriteArrayList<>();

    @Override
    public Book saveBook(Book book) {
        BookValidator.validate(book);

        if (StringUtils.isBlank(book.getId())) {
            book.setId(UUID.randomUUID().toString());
        }
        book.setCreatedAtIfNull();

        if (book.getAvailableCopies() == null && book.getTotalCopies() != null) {
            book.setAvailableCopies(book.getTotalCopies());
        }

        bookStore.add(book);
        return book;
    }

    @Override
    public Book updateBook(String id, Book book) {
        BookValidator.validateId(id);
        BookValidator.validate(book);

        Book existing = getBookById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Book not found with ID: " + id);
        }

        existing.setTitle(book.getTitle());
        existing.setAuthors(book.getAuthors() != null && !book.getAuthors().isEmpty() ? book.getAuthors() : existing.getAuthors());
        existing.setPublicationId(book.getPublicationId());
        existing.setVendorId(book.getVendorId());
        existing.setIsbn(book.getIsbn());
        existing.setTotalCopies(book.getTotalCopies());
        existing.setAvailableCopies(book.getAvailableCopies());
        existing.setCategories(book.getCategories() != null && !book.getCategories().isEmpty() ? book.getCategories() : existing.getCategories());
        existing.setPurchaseDate(book.getPurchaseDate());
        existing.setPrice(book.getPrice());

        if (existing.getAvailableCopies() == null && existing.getTotalCopies() != null) {
            existing.setAvailableCopies(existing.getTotalCopies());
        }

        return existing;
    }

    @Override
    public void deleteBook(String id) {
        BookValidator.validateId(id);
        boolean removed = bookStore.removeIf(book -> id.equals(book.getId()));
        if (!removed) {
            throw new IllegalArgumentException("Book not found with ID: " + id);
        }
    }

    @Override
    public List<Book> getAllBooks() {
        return List.copyOf(bookStore);
    }

    @Override
    public Book getBookById(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        return bookStore.stream()
                .filter(book -> id.equals(book.getId()))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Book> searchBooks(String searchTerm) {
        if (StringUtils.isBlank(searchTerm)) {
            return getAllBooks();
        }
        String lowerSearchTerm = searchTerm.toLowerCase().trim();
        return bookStore.stream()
                .filter(book -> {
                    String title = book.getTitle() != null ? book.getTitle().toLowerCase() : "";
                    String isbn = book.getIsbn() != null ? book.getIsbn().toLowerCase() : "";
                    String authors = book.getAuthors() != null
                            ? String.join(" ", book.getAuthors()).toLowerCase()
                            : "";
                    String categories = book.getCategories() != null
                            ? String.join(" ", book.getCategories()).toLowerCase()
                            : "";
                    return title.contains(lowerSearchTerm) || isbn.contains(lowerSearchTerm) ||
                            authors.contains(lowerSearchTerm) || categories.contains(lowerSearchTerm);
                })
                .collect(Collectors.toList());
    }
}
