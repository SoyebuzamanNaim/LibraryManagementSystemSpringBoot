package bd.edu.seu.librarymanagementsystem.controller;

import bd.edu.seu.librarymanagementsystem.dto.BookRequestDTO;
import bd.edu.seu.librarymanagementsystem.model.Book;
import bd.edu.seu.librarymanagementsystem.service.ActivityService;
import bd.edu.seu.librarymanagementsystem.service.BookService;
import bd.edu.seu.librarymanagementsystem.service.PublicationService;
import bd.edu.seu.librarymanagementsystem.service.VendorService;
import bd.edu.seu.librarymanagementsystem.util.RedirectUtil;
import bd.edu.seu.librarymanagementsystem.util.SessionManager;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Controller
public class BookController {

    private final BookService bookService;
    private final PublicationService publicationService;
    private final VendorService vendorService;
    private final ActivityService activityService;

    public BookController(BookService bookService, PublicationService publicationService,
            VendorService vendorService, ActivityService activityService) {
        this.bookService = bookService;
        this.publicationService = publicationService;
        this.vendorService = vendorService;
        this.activityService = activityService;
    }

    @GetMapping("/books")
    public String books(@RequestParam(required = false) String search, Model model,
            HttpSession session, RedirectAttributes redirectAttributes) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        if (search != null && !search.trim().isEmpty()) {
            model.addAttribute("books", bookService.searchBooks(search));
            model.addAttribute("searchTerm", search);
        } else {
            model.addAttribute("books", bookService.getAllBooks());
        }
        model.addAttribute("publications", publicationService.getAllPublications());
        model.addAttribute("vendors", vendorService.getAllVendors());
        return "books";
    }

    @PostMapping("/books")
    public String createBook(@RequestParam(required = false) String authors,
            @RequestParam(required = false) String categories,
            @ModelAttribute BookRequestDTO requestDTO,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            List<String> authorsList = parseList(authors);
            List<String> categoriesList = parseList(categories);

            BookRequestDTO dto = new BookRequestDTO(
                    requestDTO.title(),
                    authorsList,
                    requestDTO.publicationId(),
                    requestDTO.vendorId(),
                    requestDTO.isbn(),
                    requestDTO.totalCopies(),
                    requestDTO.availableCopies(),
                    categoriesList,
                    requestDTO.purchaseDate(),
                    requestDTO.price());

            Book book = new Book();
            book.setTitle(dto.title());
            book.setAuthors(dto.authors() != null ? dto.authors() : new ArrayList<>());
            book.setPublicationId(StringUtils.isBlank(dto.publicationId()) ? null : dto.publicationId());
            book.setVendorId(StringUtils.isBlank(dto.vendorId()) ? null : dto.vendorId());
            book.setIsbn(StringUtils.isBlank(dto.isbn()) ? null : dto.isbn());
            book.setTotalCopies(dto.totalCopies());
            book.setAvailableCopies(dto.availableCopies());
            book.setCategories(dto.categories() != null ? dto.categories() : new ArrayList<>());
            book.setPurchaseDate(dto.purchaseDate());
            book.setPrice(dto.price());
            Book savedBook = bookService.saveBook(book);
            String actor = SessionManager.getEmail(session);
            activityService.logActivity("Book Added", "Added book: " + savedBook.getTitle(), actor);
            redirectAttributes.addFlashAttribute("successMessage", "Book created successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error creating book: " + ex.getMessage());
        }
        return "redirect:/books";
    }

    @PostMapping("/books/update")
    public String updateBook(@RequestParam String id,
            @RequestParam(required = false) String authors,
            @RequestParam(required = false) String categories,
            @ModelAttribute BookRequestDTO requestDTO,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            List<String> authorsList = parseList(authors);
            List<String> categoriesList = parseList(categories);

            BookRequestDTO dto = new BookRequestDTO(
                    requestDTO.title(),
                    authorsList,
                    requestDTO.publicationId(),
                    requestDTO.vendorId(),
                    requestDTO.isbn(),
                    requestDTO.totalCopies(),
                    requestDTO.availableCopies(),
                    categoriesList,
                    requestDTO.purchaseDate(),
                    requestDTO.price());

            Book book = new Book();
            book.setTitle(dto.title());
            book.setAuthors(dto.authors() != null ? dto.authors() : new ArrayList<>());
            book.setPublicationId(StringUtils.isBlank(dto.publicationId()) ? null : dto.publicationId());
            book.setVendorId(StringUtils.isBlank(dto.vendorId()) ? null : dto.vendorId());
            book.setIsbn(StringUtils.isBlank(dto.isbn()) ? null : dto.isbn());
            book.setTotalCopies(dto.totalCopies());
            book.setAvailableCopies(dto.availableCopies());
            book.setCategories(dto.categories() != null ? dto.categories() : new ArrayList<>());
            book.setPurchaseDate(dto.purchaseDate());
            book.setPrice(dto.price());
            Book existingBook = bookService.getBookById(id);
            String bookTitle = existingBook != null ? existingBook.getTitle() : "Unknown";
            bookService.updateBook(id, book);
            String actor = SessionManager.getEmail(session);
            activityService.logActivity("Book Updated", "Updated book: " + bookTitle, actor);
            redirectAttributes.addFlashAttribute("successMessage", "Book updated successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error updating book: " + ex.getMessage());
        }
        return "redirect:/books";
    }

    @PostMapping("/books/delete")
    public String deleteBook(@RequestParam String id,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            Book book = bookService.getBookById(id);
            String bookTitle = book != null ? book.getTitle() : "Unknown";
            bookService.deleteBook(id);
            String actor = SessionManager.getEmail(session);
            activityService.logActivity("Book Deleted", "Deleted book: " + bookTitle, actor);
            redirectAttributes.addFlashAttribute("successMessage", "Book deleted successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/books";
    }

    private List<String> parseList(String input) {
        if (input == null || input.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(input.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(java.util.stream.Collectors.toList());
    }
}
