package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.dto.AllotmentResponseDTO;
import bd.edu.seu.librarymanagementsystem.model.Allotment;
import bd.edu.seu.librarymanagementsystem.model.Book;
import bd.edu.seu.librarymanagementsystem.model.Student;
import bd.edu.seu.librarymanagementsystem.service.AllotmentService;
import bd.edu.seu.librarymanagementsystem.service.BookService;
import bd.edu.seu.librarymanagementsystem.service.StudentService;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;
import bd.edu.seu.librarymanagementsystem.validator.AllotmentValidator;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class AllotmentServiceImplementation implements AllotmentService {

    private static final int MAX_LOAN_DAYS = 14; // 14 days is the max loan period
    private static final long FINE_PER_DAY = 20; // 20 taka per day
    private static final int MAX_BOOKS_PER_STUDENT = 3; // maximum books a student can have at once

    private final CopyOnWriteArrayList<Allotment> allotmentStore = new CopyOnWriteArrayList<>();
    private final BookService bookService;
    private final StudentService studentService;

    public AllotmentServiceImplementation(BookService bookService, StudentService studentService) {
        this.bookService = bookService;
        this.studentService = studentService;
    }

    @Override
    public Allotment saveAllotment(Allotment allotment) {
        AllotmentValidator.validate(allotment);

        Book book = bookService.getBookById(allotment.getBookId());
        if (book == null) {
            throw new IllegalArgumentException("Book not found with ID: " + allotment.getBookId());
        }

        if (book.getAvailableCopies() == null || book.getAvailableCopies() <= 0) {
            throw new IllegalArgumentException("Book is not available. No copies available.");
        }

        Student student = studentService.getStudentById(allotment.getStudentId());
        if (student == null) {
            throw new IllegalArgumentException("Student not found with ID: " + allotment.getStudentId());
        }

        long activeAllotmentsCount = allotmentStore.stream()
                .filter(a -> allotment.getStudentId().equals(a.getStudentId()) && a.getReturnedAt() == null)
                .count();

        if (activeAllotmentsCount >= MAX_BOOKS_PER_STUDENT) {
            throw new IllegalArgumentException("Student has reached the maximum limit of " + MAX_BOOKS_PER_STUDENT
                    + " books. Please return a book before taking another one.");
        }

        if (allotment.getAllottedAt() != null && allotment.getDueAt() != null) {
            long daysBetween = ChronoUnit.DAYS.between(allotment.getAllottedAt(), allotment.getDueAt());
            if (daysBetween > MAX_LOAN_DAYS) {
                allotment.setDueAt(allotment.getAllottedAt().plusDays(MAX_LOAN_DAYS));
            }
        } else if (allotment.getAllottedAt() != null) {
            allotment.setDueAt(allotment.getAllottedAt().plusDays(MAX_LOAN_DAYS));
        }

        if (StringUtils.isBlank(allotment.getId())) {
            allotment.setId(UUID.randomUUID().toString());
        }

        allotment.setAllottedAtIfNull();
        allotment.setStatusIfNull();
        allotment.setFineAmount(0L);

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookService.updateBook(book.getId(), book);

        allotmentStore.add(allotment);
        return allotment;
    }

    @Override
    public Allotment updateAllotment(String id, Allotment allotment) {
        AllotmentValidator.validateId(id);
        Allotment existing = getAllotmentEntityById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Allotment not found with ID: " + id);
        }

        if (existing.getReturnedAt() != null && allotment.getReturnedAt() == null) {
            throw new IllegalArgumentException("Cannot update a returned allotment");
        }

        if (allotment.getBookId() != null) {
            existing.setBookId(allotment.getBookId());
        }
        if (allotment.getStudentId() != null) {
            existing.setStudentId(allotment.getStudentId());
        }
        if (allotment.getDueAt() != null) {
            existing.setDueAt(allotment.getDueAt());
        }
        if (allotment.getStatus() != null) {
            existing.setStatus(allotment.getStatus());
        }
        if (allotment.getReturnedAt() != null) {
            existing.setReturnedAt(allotment.getReturnedAt());
        }
        if (allotment.getFineAmount() != null) {
            existing.setFineAmount(allotment.getFineAmount());
        }

        return existing;
    }

    @Override
    public void deleteAllotment(String id) {
        AllotmentValidator.validateId(id);
        Allotment existing = getAllotmentEntityById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Allotment not found with ID: " + id);
        }

        if (existing.getReturnedAt() == null) {
            Book book = bookService.getBookById(existing.getBookId());
            if (book != null) {
                book.setAvailableCopies(book.getAvailableCopies() + 1);
                bookService.updateBook(book.getId(), book);
            }
        }

        boolean removed = allotmentStore.removeIf(allotment -> id.equals(allotment.getId()));
        if (!removed) {
            throw new IllegalArgumentException("Allotment not found with ID: " + id);
        }
    }

    @Override
    public List<AllotmentResponseDTO> getAllAllotments() {
        return allotmentStore.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AllotmentResponseDTO getAllotmentById(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        Allotment allotment = getAllotmentEntityById(id);
        return allotment != null ? convertToResponseDTO(allotment) : null;
    }

    @Override
    public List<AllotmentResponseDTO> searchAllotments(String searchTerm) {
        if (StringUtils.isBlank(searchTerm)) {
            return getAllAllotments();
        }
        String lowerSearchTerm = searchTerm.toLowerCase().trim();
        return allotmentStore.stream()
                .map(this::convertToResponseDTO)
                .filter(dto -> {
                    String bookTitle = dto.bookTitle() != null ? dto.bookTitle().toLowerCase() : "";
                    String studentName = dto.studentName() != null ? dto.studentName().toLowerCase() : "";
                    String studentRoll = dto.studentRoll() != null ? dto.studentRoll().toLowerCase() : "";
                    return bookTitle.contains(lowerSearchTerm) ||
                            studentName.contains(lowerSearchTerm) ||
                            studentRoll.contains(lowerSearchTerm);
                })
                .collect(Collectors.toList());
    }

    @Override
    public Allotment returnBook(String id) {
        AllotmentValidator.validateId(id);
        Allotment allotment = getAllotmentEntityById(id);
        if (allotment == null) {
            throw new IllegalArgumentException("Allotment not found with ID: " + id);
        }

        if (allotment.getReturnedAt() != null) {
            throw new IllegalArgumentException("Book has already been returned");
        }

        allotment.setReturnedAt(LocalDateTime.now());
        allotment.setStatus("returned");

        // Calculate and set fine
        Long fineAmount = calculateFine(allotment);
        allotment.setFineAmount(fineAmount);

        // Increase available copies
        Book book = bookService.getBookById(allotment.getBookId());
        if (book != null) {
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookService.updateBook(book.getId(), book);
        }

        return allotment;
    }

    @Override
    public Long calculateFine(Allotment allotment) {
        if (allotment == null || allotment.getDueAt() == null) {
            return 0L;
        }

        LocalDateTime returnDate = allotment.getReturnedAt() != null
                ? allotment.getReturnedAt()
                : LocalDateTime.now();

        // If returned before or on due date, no fine
        if (!returnDate.isAfter(allotment.getDueAt())) {
            return 0L;
        }

        // Calculate days overdue
        long daysOverdue = ChronoUnit.DAYS.between(allotment.getDueAt(), returnDate);
        if (daysOverdue <= 0) {
            return 0L;
        }

        // Calculate fine: 20 taka per day
        return daysOverdue * FINE_PER_DAY;
    }

    private Allotment getAllotmentEntityById(String id) {
        return allotmentStore.stream()
                .filter(allotment -> id.equals(allotment.getId()))
                .findFirst()
                .orElse(null);
    }

    private AllotmentResponseDTO convertToResponseDTO(Allotment allotment) {
        Book book = bookService.getBookById(allotment.getBookId());
        Student student = studentService.getStudentById(allotment.getStudentId());

        String bookTitle = book != null ? book.getTitle() : "Unknown";
        String studentName = student != null ? student.getName() : "Unknown";
        String studentRoll = student != null ? student.getRoll() : "-";
        String allottedByName = null; // Could be enhanced to get user name if needed

        // Calculate fine if not returned and overdue
        Long fineAmount = allotment.getFineAmount();
        Boolean isOverdue = false;

        if (allotment.getReturnedAt() == null && allotment.getDueAt() != null) {
            isOverdue = LocalDateTime.now().isAfter(allotment.getDueAt());
            if (isOverdue) {
                fineAmount = calculateFine(allotment);
            }
        }

        return new AllotmentResponseDTO(
                allotment.getId(),
                allotment.getBookId(),
                bookTitle,
                allotment.getStudentId(),
                studentName,
                studentRoll,
                allotment.getAllottedBy(),
                allottedByName,
                allotment.getAllottedAt(),
                allotment.getDueAt(),
                allotment.getReturnedAt(),
                allotment.getStatus(),
                fineAmount,
                isOverdue);
    }
}
