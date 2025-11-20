package bd.edu.seu.librarymanagementsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BookController {

    @GetMapping("/books")
    public String books() {
        return "books";
    }

    @GetMapping("/add-book")
    public String addBook() {
        return "add-book";
    }

    @GetMapping("/edit-book")
    public String editBook() {
        return "edit-book";
    }
}
