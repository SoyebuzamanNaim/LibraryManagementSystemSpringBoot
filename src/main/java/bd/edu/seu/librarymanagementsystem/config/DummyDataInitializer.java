package bd.edu.seu.librarymanagementsystem.config;

import bd.edu.seu.librarymanagementsystem.model.Allotment;
import bd.edu.seu.librarymanagementsystem.model.Book;
import bd.edu.seu.librarymanagementsystem.model.Publication;
import bd.edu.seu.librarymanagementsystem.model.Student;
import bd.edu.seu.librarymanagementsystem.model.Subscription;
import bd.edu.seu.librarymanagementsystem.model.Vendor;
import bd.edu.seu.librarymanagementsystem.service.AllotmentService;
import bd.edu.seu.librarymanagementsystem.service.BookService;
import bd.edu.seu.librarymanagementsystem.service.PublicationService;
import bd.edu.seu.librarymanagementsystem.service.StudentService;
import bd.edu.seu.librarymanagementsystem.service.SubscriptionService;
import bd.edu.seu.librarymanagementsystem.service.VendorService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DummyDataInitializer {

    private final StudentService studentService;
    private final PublicationService publicationService;
    private final VendorService vendorService;
    private final BookService bookService;
    private final SubscriptionService subscriptionService;
    private final AllotmentService allotmentService;

    public DummyDataInitializer(
            StudentService studentService,
            PublicationService publicationService,
            VendorService vendorService,
            BookService bookService,
            SubscriptionService subscriptionService,
            AllotmentService allotmentService) {
        this.studentService = studentService;
        this.publicationService = publicationService;
        this.vendorService = vendorService;
        this.bookService = bookService;
        this.subscriptionService = subscriptionService;
        this.allotmentService = allotmentService;
    }

    @PostConstruct
    public void initializeDummyData() {
        try {
            // System.out.println("=== Initializing dummy data ===");
            initializeStudents();
            // System.out.println("Students initialized: " +
            // studentService.getAllStudents().size());
            initializePublications();
            // System.out.println("Publications initialized: " +
            // publicationService.getAllPublications().size());
            initializeVendors();
            // System.out.println("Vendors initialized: " +
            // vendorService.getAllVendors().size());
            initializeBooks();
            // System.out.println("Books initialized: " + bookService.getAllBooks().size());
            initializeSubscriptions();
            // System.out.println("Subscriptions initialized: " +
            // subscriptionService.getAllSubscriptions().size());
            initializeAllotments();
            // System.out.println("Allotments initialized: " +
            // allotmentService.getAllAllotments().size());
            // System.out.println("=== Dummy data initialization completed ===");
        } catch (Exception e) {
            // System.err.println("Error initializing dummy data: " + e.getMessage());
            // e.printStackTrace();
        }
    }

    private void initializeStudents() {
        if (!studentService.getAllStudents().isEmpty()) {
            return;
        }

        Student student1 = new Student();
        student1.setName("Jihad Mia");
        student1.setRoll("2023200000001");
        student1.setEmail("2023200000001@seu.edu.bd");
        student1.setPhone("01712345678");
        student1.setDepartment("Computer Science & Engineering");
        student1.setCreatedAt(LocalDate.now().minusDays(30));
        studentService.saveStudent(student1);

        Student student2 = new Student();
        student2.setName("Sifat Mia");
        student2.setRoll("2023200000002");
        student2.setEmail("2023200000002@seu.edu.bd");
        student2.setPhone("01823456789");
        student2.setDepartment("Electrical & Electronic Engineering");
        student2.setCreatedAt(LocalDate.now().minusDays(25));
        studentService.saveStudent(student2);

        Student student3 = new Student();
        student3.setName("Jubayer Mia");
        student3.setRoll("2023200000003");
        student3.setEmail("2023200000003@seu.edu.bd");
        student3.setPhone("01934567890");
        student3.setDepartment("Business Administration");
        student3.setCreatedAt(LocalDate.now().minusDays(20));
        studentService.saveStudent(student3);

        Student student4 = new Student();
        student4.setName("Samir Mia");
        student4.setRoll("2023200000004");
        student4.setEmail("2023200000004@seu.edu.bd");
        student4.setPhone("01645678901");
        student4.setDepartment("Computer Science & Engineering");
        student4.setCreatedAt(LocalDate.now().minusDays(15));
        studentService.saveStudent(student4);

        Student student5 = new Student();
        student5.setName("Soyebuzaman Naim");
        student5.setRoll("2023200000005");
        student5.setEmail("2023200000005@seu.edu.bd");
        student5.setPhone("01556789012");
        student5.setDepartment("Mechanical Engineering");
        student5.setCreatedAt(LocalDate.now().minusDays(10));
        studentService.saveStudent(student5);

        Student student6 = new Student();
        student6.setName("Mst Jahan");
        student6.setRoll("2023200000006");
        student6.setEmail("2023200000006@seu.edu.bd");
        student6.setPhone("01467890123");
        student6.setDepartment("Civil Engineering");
        student6.setCreatedAt(LocalDate.now().minusDays(5));
        studentService.saveStudent(student6);
    }

    private void initializePublications() {
        if (!publicationService.getAllPublications().isEmpty()) {
            return;
        }

        Publication pub1 = new Publication();
        pub1.setName("Anannya Publications");
        pub1.setAddress("Banglamotor, Dhaka");
        pub1.setCreatedAt(LocalDate.now().minusDays(60));
        publicationService.savePublication(pub1);

        Publication pub2 = new Publication();
        pub2.setName("Nazrul Academy Publications");
        pub2.setAddress("Shahbag, Dhaka");
        pub2.setCreatedAt(LocalDate.now().minusDays(55));
        publicationService.savePublication(pub2);

        Publication pub3 = new Publication();
        pub3.setName("Prothoma Prokashoni");
        pub3.setAddress("Mohakhali, Dhaka");
        pub3.setCreatedAt(LocalDate.now().minusDays(50));
        publicationService.savePublication(pub3);

        Publication pub4 = new Publication();
        pub4.setName("Jagriti Prokashon");
        pub4.setAddress("Dhanmondi, Dhaka");
        pub4.setCreatedAt(LocalDate.now().minusDays(45));
        publicationService.savePublication(pub4);

        Publication pub5 = new Publication();
        pub5.setName("Lok Publications");
        pub5.setAddress("Uttara, Dhaka");
        pub5.setCreatedAt(LocalDate.now().minusDays(40));
        publicationService.savePublication(pub5);

        Publication pub6 = new Publication();
        pub6.setName("Bangla Academy Publications");
        pub6.setAddress("Ramna, Dhaka");
        pub6.setCreatedAt(LocalDate.now().minusDays(35));
        publicationService.savePublication(pub6);
    }

    private void initializeVendors() {
        if (!vendorService.getAllVendors().isEmpty()) {
            return;
        }

        Vendor vendor1 = new Vendor();
        vendor1.setName("City Book House");
        vendor1.setEmail("citybookhouse@bd.com");
        vendor1.setPhone("01711111111");
        vendor1.setAddress("Azimpur, Dhaka");
        vendor1.setCreatedAt(LocalDate.now().minusDays(50));
        vendorService.saveVendor(vendor1);

        Vendor vendor2 = new Vendor();
        vendor2.setName("Academic Book Supply");
        vendor2.setEmail("academicbooks@bd.com");
        vendor2.setPhone("01822222222");
        vendor2.setAddress("Dhanmondi, Dhaka");
        vendor2.setCreatedAt(LocalDate.now().minusDays(45));
        vendorService.saveVendor(vendor2);

        Vendor vendor3 = new Vendor();
        vendor3.setName("University Book Corner");
        vendor3.setEmail("unibook@bd.com");
        vendor3.setPhone("01933333333");
        vendor3.setAddress("New Market, Dhaka");
        vendor3.setCreatedAt(LocalDate.now().minusDays(40));
        vendorService.saveVendor(vendor3);

        Vendor vendor4 = new Vendor();
        vendor4.setName("Education Materials Hub");
        vendor4.setEmail("eduhub@bd.com");
        vendor4.setPhone("01644444444");
        vendor4.setAddress("Mohakhali, Dhaka");
        vendor4.setCreatedAt(LocalDate.now().minusDays(35));
        vendorService.saveVendor(vendor4);

        Vendor vendor5 = new Vendor();
        vendor5.setName("Textbook Solutions");
        vendor5.setEmail("textbook@bd.com");
        vendor5.setPhone("01555555555");
        vendor5.setAddress("Mirpur, Dhaka");
        vendor5.setCreatedAt(LocalDate.now().minusDays(30));
        vendorService.saveVendor(vendor5);

        Vendor vendor6 = new Vendor();
        vendor6.setName("Knowledge Base Publishers");
        vendor6.setEmail("knowledge@bd.com");
        vendor6.setPhone("01466666666");
        vendor6.setAddress("Wari, Dhaka");
        vendor6.setCreatedAt(LocalDate.now().minusDays(25));
        vendorService.saveVendor(vendor6);
    }

    private void initializeBooks() {
        if (!bookService.getAllBooks().isEmpty()) {
            return;
        }

        var publications = publicationService.getAllPublications();
        var vendors = vendorService.getAllVendors();

        if (publications.isEmpty() || vendors.isEmpty()) {
            return;
        }

        String pub1Id = publications.get(0).getId();
        String pub2Id = publications.get(1).getId();
        String pub3Id = publications.get(2).getId();
        String vendor1Id = vendors.get(0).getId();
        String vendor2Id = vendors.get(1).getId();
        String vendor3Id = vendors.get(2).getId();

        Book book1 = new Book();
        book1.setTitle("Data Structures and Algorithms in Java");
        book1.setAuthors(List.of("Robert Lafore", "Michael Goodrich"));
        book1.setPublicationId(pub1Id);
        book1.setVendorId(vendor1Id);
        book1.setIsbn("978-0134685991");
        book1.setTotalCopies(15);
        book1.setAvailableCopies(12);
        book1.setCategories(List.of("Computer Science", "Programming", "Algorithms"));
        book1.setPurchaseDate(LocalDate.now().minusDays(90));
        book1.setPrice(2500);
        book1.setCreatedAt(LocalDate.now().minusDays(90));
        bookService.saveBook(book1);

        Book book2 = new Book();
        book2.setTitle("Introduction to Database Systems");
        book2.setAuthors(List.of("C. J. Date", "Hugh Darwen"));
        book2.setPublicationId(pub2Id);
        book2.setVendorId(vendor2Id);
        book2.setIsbn("978-0133970777");
        book2.setTotalCopies(20);
        book2.setAvailableCopies(18);
        book2.setCategories(List.of("Database", "Computer Science"));
        book2.setPurchaseDate(LocalDate.now().minusDays(85));
        book2.setPrice(2800);
        book2.setCreatedAt(LocalDate.now().minusDays(85));
        bookService.saveBook(book2);

        Book book3 = new Book();
        book3.setTitle("Operating System Concepts");
        book3.setAuthors(List.of("Abraham Silberschatz", "Peter Baer Galvin", "Greg Gagne"));
        book3.setPublicationId(pub3Id);
        book3.setVendorId(vendor3Id);
        book3.setIsbn("978-1119800366");
        book3.setTotalCopies(12);
        book3.setAvailableCopies(10);
        book3.setCategories(List.of("Operating Systems", "Computer Science"));
        book3.setPurchaseDate(LocalDate.now().minusDays(80));
        book3.setPrice(3200);
        book3.setCreatedAt(LocalDate.now().minusDays(80));
        bookService.saveBook(book3);

        Book book4 = new Book();
        book4.setTitle("Computer Networks");
        book4.setAuthors(List.of("Andrew S. Tanenbaum", "David J. Wetherall"));
        book4.setPublicationId(pub1Id);
        book4.setVendorId(vendor1Id);
        book4.setIsbn("978-0132126953");
        book4.setTotalCopies(18);
        book4.setAvailableCopies(15);
        book4.setCategories(List.of("Networking", "Computer Science"));
        book4.setPurchaseDate(LocalDate.now().minusDays(75));
        book4.setPrice(3000);
        book4.setCreatedAt(LocalDate.now().minusDays(75));
        bookService.saveBook(book4);

        Book book5 = new Book();
        book5.setTitle("Software Engineering: A Practitioner's Approach");
        book5.setAuthors(List.of("Roger S. Pressman", "Bruce Maxim"));
        book5.setPublicationId(pub2Id);
        book5.setVendorId(vendor2Id);
        book5.setIsbn("978-1259872976");
        book5.setTotalCopies(14);
        book5.setAvailableCopies(11);
        book5.setCategories(List.of("Software Engineering", "Computer Science"));
        book5.setPurchaseDate(LocalDate.now().minusDays(70));
        book5.setPrice(2700);
        book5.setCreatedAt(LocalDate.now().minusDays(70));
        bookService.saveBook(book5);

        Book book6 = new Book();
        book6.setTitle("Artificial Intelligence: A Modern Approach");
        book6.setAuthors(List.of("Stuart Russell", "Peter Norvig"));
        book6.setPublicationId(pub3Id);
        book6.setVendorId(vendor3Id);
        book6.setIsbn("978-0134610993");
        book6.setTotalCopies(10);
        book6.setAvailableCopies(8);
        book6.setCategories(List.of("Artificial Intelligence", "Computer Science", "Machine Learning"));
        book6.setPurchaseDate(LocalDate.now().minusDays(65));
        book6.setPrice(3500);
        book6.setCreatedAt(LocalDate.now().minusDays(65));
        bookService.saveBook(book6);

        Book book7 = new Book();
        book7.setTitle("Digital Logic and Computer Design");
        book7.setAuthors(List.of("M. Morris Mano", "Michael D. Ciletti"));
        book7.setPublicationId(pub1Id);
        book7.setVendorId(vendor1Id);
        book7.setIsbn("978-0132774209");
        book7.setTotalCopies(16);
        book7.setAvailableCopies(14);
        book7.setCategories(List.of("Digital Logic", "Computer Architecture", "Electronics"));
        book7.setPurchaseDate(LocalDate.now().minusDays(60));
        book7.setPrice(2400);
        book7.setCreatedAt(LocalDate.now().minusDays(60));
        bookService.saveBook(book7);

        Book book8 = new Book();
        book8.setTitle("Microprocessor Architecture, Programming, and Applications");
        book8.setAuthors(List.of("Ramesh Gaonkar"));
        book8.setPublicationId(pub2Id);
        book8.setVendorId(vendor2Id);
        book8.setIsbn("978-0133627645");
        book8.setTotalCopies(13);
        book8.setAvailableCopies(10);
        book8.setCategories(List.of("Microprocessor", "Computer Architecture", "Embedded Systems"));
        book8.setPurchaseDate(LocalDate.now().minusDays(55));
        book8.setPrice(2200);
        book8.setCreatedAt(LocalDate.now().minusDays(55));
        bookService.saveBook(book8);
    }

    private void initializeSubscriptions() {
        if (!subscriptionService.getAllSubscriptions().isEmpty()) {
            return;
        }

        List<Student> students = studentService.getAllStudents();

        if (!students.isEmpty()) {
            Student student1 = students.get(0);
            Subscription sub1 = new Subscription();
            sub1.setStudentId(student1.getId());
            sub1.setType("Annual");
            sub1.setStartDate(LocalDate.now().minusMonths(6));
            sub1.setEndDate(LocalDate.now().plusMonths(6));
            sub1.setActive(true);
            subscriptionService.saveSubscription(sub1);

            if (students.size() > 1) {
                Student student2 = students.get(1);
                Subscription sub2 = new Subscription();
                sub2.setStudentId(student2.getId());
                sub2.setType("Semester");
                sub2.setStartDate(LocalDate.now().minusMonths(2));
                sub2.setEndDate(LocalDate.now().plusMonths(4));
                sub2.setActive(true);
                subscriptionService.saveSubscription(sub2);
            }

            if (students.size() > 2) {
                Student student3 = students.get(2);
                Subscription sub3 = new Subscription();
                sub3.setStudentId(student3.getId());
                sub3.setType("Monthly");
                sub3.setStartDate(LocalDate.now().minusDays(15));
                sub3.setEndDate(LocalDate.now().plusDays(15));
                sub3.setActive(true);
                subscriptionService.saveSubscription(sub3);
            }

            if (students.size() > 3) {
                Student student4 = students.get(3);
                Subscription sub4 = new Subscription();
                sub4.setStudentId(student4.getId());
                sub4.setType("Annual");
                sub4.setStartDate(LocalDate.now().minusMonths(12));
                sub4.setEndDate(LocalDate.now().minusDays(1));
                sub4.setActive(false);
                subscriptionService.saveSubscription(sub4);
            }
        }
    }

    private void initializeAllotments() {
        if (!allotmentService.getAllAllotments().isEmpty()) {
            return;
        }

        List<Student> students = studentService.getAllStudents();
        List<Book> books = bookService.getAllBooks();

        if (students.isEmpty() || books.isEmpty()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        Allotment allotment1 = new Allotment();
        allotment1.setBookId(books.get(0).getId());
        allotment1.setStudentId(students.get(0).getId());
        allotment1.setAllottedBy("admin@library.com");
        allotment1.setAllottedAt(now.minusDays(5));
        allotment1.setDueAt(now.plusDays(9));
        allotment1.setStatus("active");
        allotment1.setFineAmount(0L);
        allotmentService.saveAllotment(allotment1);

        Allotment allotment2 = new Allotment();
        allotment2.setBookId(books.get(1).getId());
        allotment2.setStudentId(students.get(1).getId());
        allotment2.setAllottedBy("admin@library.com");
        allotment2.setAllottedAt(now.minusDays(10));
        allotment2.setDueAt(now.minusDays(3));
        allotment2.setStatus("active");
        allotment2.setFineAmount(0L);
        allotmentService.saveAllotment(allotment2);

        Allotment allotment3 = new Allotment();
        allotment3.setBookId(books.get(2).getId());
        allotment3.setStudentId(students.get(2).getId());
        allotment3.setAllottedBy("admin@library.com");
        allotment3.setAllottedAt(now.minusDays(20));
        allotment3.setDueAt(now.minusDays(6));
        allotment3.setStatus("active");
        allotment3.setFineAmount(0L);
        allotmentService.saveAllotment(allotment3);

        Allotment allotment4 = new Allotment();
        allotment4.setBookId(books.get(3).getId());
        allotment4.setStudentId(students.get(0).getId());
        allotment4.setAllottedBy("admin@library.com");
        allotment4.setAllottedAt(now.minusDays(30));
        allotment4.setDueAt(now.minusDays(16));
        allotment4.setStatus("active");
        Allotment saved4 = allotmentService.saveAllotment(allotment4);
        saved4.setReturnedAt(now.minusDays(15));
        saved4.setStatus("returned");
        saved4.setFineAmount(20L);
        allotmentService.updateAllotment(saved4.getId(), saved4);
        Book book4 = bookService.getBookById(books.get(3).getId());
        if (book4 != null) {
            book4.setAvailableCopies(book4.getAvailableCopies() + 1);
            bookService.updateBook(book4.getId(), book4);
        }

        Allotment allotment5 = new Allotment();
        allotment5.setBookId(books.get(4).getId());
        allotment5.setStudentId(students.get(1).getId());
        allotment5.setAllottedBy("admin@library.com");
        allotment5.setAllottedAt(now.minusDays(25));
        allotment5.setDueAt(now.minusDays(11));
        allotment5.setStatus("active");
        Allotment saved5 = allotmentService.saveAllotment(allotment5);
        saved5.setReturnedAt(now.minusDays(8));
        saved5.setStatus("returned");
        saved5.setFineAmount(60L);
        allotmentService.updateAllotment(saved5.getId(), saved5);
        Book book5 = bookService.getBookById(books.get(4).getId());
        if (book5 != null) {
            book5.setAvailableCopies(book5.getAvailableCopies() + 1);
            bookService.updateBook(book5.getId(), book5);
        }

        Allotment allotment6 = new Allotment();
        allotment6.setBookId(books.get(5).getId());
        allotment6.setStudentId(students.get(2).getId());
        allotment6.setAllottedBy("admin@library.com");
        allotment6.setAllottedAt(now.minusDays(35));
        allotment6.setDueAt(now.minusDays(21));
        allotment6.setStatus("active");
        Allotment saved6 = allotmentService.saveAllotment(allotment6);
        saved6.setReturnedAt(now.minusDays(20));
        saved6.setStatus("returned");
        saved6.setFineAmount(0L);
        allotmentService.updateAllotment(saved6.getId(), saved6);
        Book book6 = bookService.getBookById(books.get(5).getId());
        if (book6 != null) {
            book6.setAvailableCopies(book6.getAvailableCopies() + 1);
            bookService.updateBook(book6.getId(), book6);
        }

        Allotment allotment7 = new Allotment();
        allotment7.setBookId(books.get(6).getId());
        allotment7.setStudentId(students.get(3).getId());
        allotment7.setAllottedBy("admin@library.com");
        allotment7.setAllottedAt(now.minusDays(8));
        allotment7.setDueAt(now.plusDays(6));
        allotment7.setStatus("active");
        allotment7.setFineAmount(0L);
        allotmentService.saveAllotment(allotment7);

        Allotment allotment8 = new Allotment();
        allotment8.setBookId(books.get(7).getId());
        allotment8.setStudentId(students.get(4).getId());
        allotment8.setAllottedBy("admin@library.com");
        allotment8.setAllottedAt(now.minusDays(40));
        allotment8.setDueAt(now.minusDays(26));
        allotment8.setStatus("active");
        Allotment saved8 = allotmentService.saveAllotment(allotment8);
        saved8.setReturnedAt(now.minusDays(20));
        saved8.setStatus("returned");
        saved8.setFineAmount(120L);
        allotmentService.updateAllotment(saved8.getId(), saved8);
        Book book8 = bookService.getBookById(books.get(7).getId());
        if (book8 != null) {
            book8.setAvailableCopies(book8.getAvailableCopies() + 1);
            bookService.updateBook(book8.getId(), book8);
        }

    }
}
