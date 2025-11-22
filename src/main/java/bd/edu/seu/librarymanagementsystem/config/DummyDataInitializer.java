package bd.edu.seu.librarymanagementsystem.config;

import bd.edu.seu.librarymanagementsystem.model.Publication;
import bd.edu.seu.librarymanagementsystem.model.Student;
import bd.edu.seu.librarymanagementsystem.model.Vendor;
import bd.edu.seu.librarymanagementsystem.service.PublicationService;
import bd.edu.seu.librarymanagementsystem.service.StudentService;
import bd.edu.seu.librarymanagementsystem.service.VendorService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DummyDataInitializer {

    private final StudentService studentService;
    private final PublicationService publicationService;
    private final VendorService vendorService;

    public DummyDataInitializer(
            StudentService studentService,
            PublicationService publicationService,
            VendorService vendorService) {
        this.studentService = studentService;
        this.publicationService = publicationService;
        this.vendorService = vendorService;
    }

    @PostConstruct
    public void initializeDummyData() {
        initializeStudents();
        initializePublications();
        initializeVendors();
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
}
