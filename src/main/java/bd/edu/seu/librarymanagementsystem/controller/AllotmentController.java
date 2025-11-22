package bd.edu.seu.librarymanagementsystem.controller;

import bd.edu.seu.librarymanagementsystem.model.Allotment;
import bd.edu.seu.librarymanagementsystem.service.ActivityService;
import bd.edu.seu.librarymanagementsystem.service.AllotmentService;
import bd.edu.seu.librarymanagementsystem.service.BookService;
import bd.edu.seu.librarymanagementsystem.service.StudentService;
import bd.edu.seu.librarymanagementsystem.util.RedirectUtil;
import bd.edu.seu.librarymanagementsystem.util.SessionManager;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;

@Controller
public class AllotmentController {

    private final AllotmentService allotmentService;
    private final BookService bookService;
    private final StudentService studentService;
    private final ActivityService activityService;

    public AllotmentController(AllotmentService allotmentService, BookService bookService,
            StudentService studentService, ActivityService activityService) {
        this.allotmentService = allotmentService;
        this.bookService = bookService;
        this.studentService = studentService;
        this.activityService = activityService;
    }

    @GetMapping("/allotments")
    public String allotments(@RequestParam(required = false) String search, Model model,
            HttpSession session, RedirectAttributes redirectAttributes) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        if (search != null && !search.trim().isEmpty()) {
            model.addAttribute("allotments", allotmentService.searchAllotments(search));
            model.addAttribute("searchTerm", search);
        } else {
            model.addAttribute("allotments", allotmentService.getAllAllotments());
        }
        model.addAttribute("books", bookService.getAllBooks());
        model.addAttribute("students", studentService.getAllStudents());
        return "allotments";
    }

    @PostMapping("/allotments")
    public String createAllotment(@RequestParam String bookId,
            @RequestParam String studentId,
            @RequestParam(required = false) String dueAt,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            Allotment allotment = new Allotment();
            allotment.setBookId(bookId);
            allotment.setStudentId(studentId);
            allotment.setAllottedAt(LocalDateTime.now());

            if (dueAt != null && !dueAt.trim().isEmpty()) {
                try {
                    String normalizedDueAt = dueAt.trim();
                    if (!normalizedDueAt.contains("T")) {
                        normalizedDueAt = normalizedDueAt + "T00:00";
                    }
                    LocalDateTime parsedDueAt = LocalDateTime.parse(normalizedDueAt);
                    allotment.setDueAt(parsedDueAt);
                } catch (Exception e) {
                    allotment.setDueAt(LocalDateTime.now().plusDays(14));
                }
            } else {
                allotment.setDueAt(LocalDateTime.now().plusDays(14));
            }

            String actor = SessionManager.getEmail(session);
            allotment.setAllottedBy(actor);
            Allotment savedAllotment = allotmentService.saveAllotment(allotment);
            var book = bookService.getBookById(savedAllotment.getBookId());
            var student = studentService.getStudentById(savedAllotment.getStudentId());
            String bookTitle = book != null ? book.getTitle() : "Unknown";
            String studentName = student != null ? student.getName() : "Unknown";
            activityService.logActivity("Book Allotted", "Allotted book: " + bookTitle + " to " + studentName, actor);
            redirectAttributes.addFlashAttribute("successMessage", "Book allotted successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/allotments";
    }

    @PostMapping("/allotments/return")
    public String returnBook(@RequestParam String id,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            var allotmentDTO = allotmentService.getAllotmentById(id);
            String bookTitle = allotmentDTO != null ? allotmentDTO.bookTitle() : "Unknown";
            String studentName = allotmentDTO != null ? allotmentDTO.studentName() : "Unknown";
            Allotment allotment = allotmentService.returnBook(id);
            Long fineAmount = allotment.getFineAmount();
            String message = "Book returned successfully";
            String details = "Returned book: " + bookTitle + " from " + studentName;
            if (fineAmount != null && fineAmount > 0) {
                message += ". Fine: " + fineAmount + " taka";
                details += " (Fine: " + fineAmount + " taka)";
            }
            String actor = SessionManager.getEmail(session);
            activityService.logActivity("Book Returned", details, actor);
            redirectAttributes.addFlashAttribute("successMessage", message);
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/allotments";
    }

    @PostMapping("/allotments/delete")
    public String deleteAllotment(@RequestParam String id,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            var allotmentDTO = allotmentService.getAllotmentById(id);
            String bookTitle = allotmentDTO != null ? allotmentDTO.bookTitle() : "Unknown";
            String studentName = allotmentDTO != null ? allotmentDTO.studentName() : "Unknown";
            allotmentService.deleteAllotment(id);
            String actor = SessionManager.getEmail(session);
            activityService.logActivity("Allotment Deleted", "Deleted allotment: " + bookTitle + " from " + studentName,
                    actor);
            redirectAttributes.addFlashAttribute("successMessage", "Allotment deleted successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/allotments";
    }
}
