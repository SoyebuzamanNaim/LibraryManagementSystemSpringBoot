package bd.edu.seu.librarymanagementsystem.service;

import bd.edu.seu.librarymanagementsystem.model.Book;

import java.util.List;

public interface BookService {
    Book saveBook(Book book);

    Book updateBook(String id, Book book);

    void deleteBook(String id);

    List<Book> getAllBooks();

    Book getBookById(String id);

    List<Book> searchBooks(String searchTerm);
}
