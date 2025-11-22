package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.model.Publication;
import bd.edu.seu.librarymanagementsystem.model.Student;
import bd.edu.seu.librarymanagementsystem.model.Vendor;
import bd.edu.seu.librarymanagementsystem.service.DuplicateChecker;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DuplicateCheckerImplementation implements DuplicateChecker {

    @Override
    public boolean isPublicationNameDuplicate(String name, List<Publication> publications, String excludeId) {
        if (name == null) {
            return false;
        }
        return publications.stream()
                .anyMatch(pub -> pub.getName() != null
                        && pub.getName().equalsIgnoreCase(name)
                        && (excludeId == null || !excludeId.equals(pub.getId())));
    }

    @Override
    public boolean isVendorNameDuplicate(String name, List<Vendor> vendors, String excludeId) {
        if (name == null) {
            return false;
        }
        return vendors.stream()
                .anyMatch(vendor -> vendor.getName() != null
                        && vendor.getName().equalsIgnoreCase(name)
                        && (excludeId == null || !excludeId.equals(vendor.getId())));
    }

    @Override
    public boolean isStudentRollDuplicate(String roll, List<Student> students, String excludeId) {
        if (roll == null) {
            return false;
        }
        return students.stream()
                .anyMatch(student -> student.getRoll() != null
                        && student.getRoll().equalsIgnoreCase(roll)
                        && (excludeId == null || !excludeId.equals(student.getId())));
    }

    @Override
    public boolean isStudentEmailDuplicate(String email, List<Student> students, String excludeId) {
        if (email == null) {
            return false;
        }
        return students.stream()
                .anyMatch(student -> student.getEmail() != null
                        && student.getEmail().equalsIgnoreCase(email)
                        && (excludeId == null || !excludeId.equals(student.getId())));
    }
}
