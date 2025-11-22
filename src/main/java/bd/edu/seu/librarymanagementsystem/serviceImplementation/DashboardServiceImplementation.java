package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.dto.AllotmentResponseDTO;
import bd.edu.seu.librarymanagementsystem.dto.DashboardStatsDTO;
import bd.edu.seu.librarymanagementsystem.model.Book;
import bd.edu.seu.librarymanagementsystem.model.Student;
import bd.edu.seu.librarymanagementsystem.model.Subscription;
import bd.edu.seu.librarymanagementsystem.service.AllotmentService;
import bd.edu.seu.librarymanagementsystem.service.BookService;
import bd.edu.seu.librarymanagementsystem.service.StudentService;
import bd.edu.seu.librarymanagementsystem.service.SubscriptionService;
import bd.edu.seu.librarymanagementsystem.service.DashboardService;
import bd.edu.seu.librarymanagementsystem.service.PublicationService;
import bd.edu.seu.librarymanagementsystem.service.VendorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardServiceImplementation implements DashboardService {

    private final BookService bookService;
    private final StudentService studentService;
    private final AllotmentService allotmentService;
    private final SubscriptionService subscriptionService;
    private final PublicationService publicationService;
    private final VendorService vendorService;

    public DashboardServiceImplementation(BookService bookService, StudentService studentService,
            AllotmentService allotmentService, SubscriptionService subscriptionService,
            PublicationService publicationService, VendorService vendorService) {
        this.bookService = bookService;
        this.studentService = studentService;
        this.allotmentService = allotmentService;
        this.subscriptionService = subscriptionService;
        this.publicationService = publicationService;
        this.vendorService = vendorService;
    }

    @Override
    public DashboardStatsDTO getDashboardStats() {
        List<Book> books = bookService.getAllBooks();
        List<Student> students = studentService.getAllStudents();
        List<AllotmentResponseDTO> allAllotments = allotmentService.getAllAllotments();
        List<Subscription> subscriptions = subscriptionService.getAllSubscriptions();

        long totalBooks = (long) books.size();
        long totalStudents = (long) students.size();
        long totalVendors = (long) vendorService.getAllVendors().size();
        long totalPublications = (long) publicationService.getAllPublications().size();

        long activeAllotments = allAllotments.stream()
                .filter(a -> a.returnedAt() == null)
                .count();
        long overdueAllotments = allAllotments.stream()
                .filter(a -> a.returnedAt() == null && a.isOverdue() != null && a.isOverdue())
                .count();

        long activeSubscriptions = subscriptions.stream()
                .filter(s -> s.getActive() != null && s.getActive())
                .count();

        // System.out.println("DashboardService - Total Books: " + totalBooks);
        // System.out.println("DashboardService - Total Students: " + totalStudents);
        // System.out.println("DashboardService - Active Allotments: " +
        // activeAllotments);

        return new DashboardStatsDTO(
                totalBooks,
                totalStudents,
                activeAllotments,
                overdueAllotments,
                totalVendors,
                totalPublications,
                activeSubscriptions);
    }
}
