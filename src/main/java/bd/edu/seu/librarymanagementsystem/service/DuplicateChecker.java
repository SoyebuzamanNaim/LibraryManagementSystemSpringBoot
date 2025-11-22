package bd.edu.seu.librarymanagementsystem.service;

import bd.edu.seu.librarymanagementsystem.model.Publication;
import bd.edu.seu.librarymanagementsystem.model.Student;
import bd.edu.seu.librarymanagementsystem.model.Vendor;

import java.util.List;

public interface DuplicateChecker {
    boolean isPublicationNameDuplicate(String name, List<Publication> publications, String excludeId);

    boolean isVendorNameDuplicate(String name, List<Vendor> vendors, String excludeId);

    boolean isStudentRollDuplicate(String roll, List<Student> students, String excludeId);

    boolean isStudentEmailDuplicate(String email, List<Student> students, String excludeId);
}
