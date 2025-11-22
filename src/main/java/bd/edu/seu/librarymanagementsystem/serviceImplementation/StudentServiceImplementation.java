package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.model.Student;
import bd.edu.seu.librarymanagementsystem.service.DuplicateChecker;
import bd.edu.seu.librarymanagementsystem.service.StudentService;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;
import bd.edu.seu.librarymanagementsystem.validator.StudentValidator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class StudentServiceImplementation implements StudentService {

    private final CopyOnWriteArrayList<Student> studentStore = new CopyOnWriteArrayList<>();
    private final DuplicateChecker duplicateChecker;

    public StudentServiceImplementation(DuplicateChecker duplicateChecker) {
        this.duplicateChecker = duplicateChecker;
    }

    @Override
    public Student saveStudent(Student student) {
        StudentValidator.validate(student);

        if (StringUtils.isBlank(student.getId())) {
            student.setId(UUID.randomUUID().toString());
        }
        student.setCreatedAtIfNull();

        if (duplicateChecker.isStudentRollDuplicate(student.getRoll(), studentStore, null)) {
            throw new IllegalArgumentException("Student roll number already exists");
        }
        if (StringUtils.hasText(student.getEmail()) &&
                duplicateChecker.isStudentEmailDuplicate(student.getEmail(), studentStore, null)) {
            throw new IllegalArgumentException("Student email already exists");
        }

        studentStore.add(student);
        return student;
    }

    @Override
    public Student updateStudent(String id, Student student) {
        StudentValidator.validateId(id);
        StudentValidator.validate(student);

        Student existing = getStudentById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Student not found with ID: " + id);
        }

        if (!existing.getRoll().equalsIgnoreCase(student.getRoll())) {
            if (duplicateChecker.isStudentRollDuplicate(student.getRoll(), studentStore, id)) {
                throw new IllegalArgumentException("Student roll number already exists");
            }
        }
        if (StringUtils.hasText(student.getEmail()) &&
                !student.getEmail().equalsIgnoreCase(existing.getEmail())) {
            if (duplicateChecker.isStudentEmailDuplicate(student.getEmail(), studentStore, id)) {
                throw new IllegalArgumentException("Student email already exists");
            }
        }

        existing.setName(student.getName());
        existing.setRoll(student.getRoll());
        existing.setEmail(student.getEmail());
        existing.setPhone(student.getPhone());
        existing.setDepartment(student.getDepartment());
        existing.setSubscriptionId(student.getSubscriptionId());
        return existing;
    }

    @Override
    public void deleteStudent(String id) {
        StudentValidator.validateId(id);
        boolean removed = studentStore.removeIf(student -> id.equals(student.getId()));
        if (!removed) {
            throw new IllegalArgumentException("Student not found with ID: " + id);
        }
    }

    @Override
    public List<Student> getAllStudents() {
        return List.copyOf(studentStore);
    }

    @Override
    public Student getStudentById(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        return studentStore.stream()
                .filter(student -> id.equals(student.getId()))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Student> searchStudents(String searchTerm) {
        if (StringUtils.isBlank(searchTerm)) {
            return getAllStudents();
        }
        String lowerSearchTerm = searchTerm.toLowerCase().trim();
        return studentStore.stream()
                .filter(student -> {
                    String name = student.getName() != null ? student.getName().toLowerCase() : "";
                    String roll = student.getRoll() != null ? student.getRoll().toLowerCase() : "";
                    String email = student.getEmail() != null ? student.getEmail().toLowerCase() : "";
                    String phone = student.getPhone() != null ? student.getPhone().toLowerCase() : "";
                    String department = student.getDepartment() != null ? student.getDepartment().toLowerCase() : "";
                    return name.contains(lowerSearchTerm) || roll.contains(lowerSearchTerm) ||
                            email.contains(lowerSearchTerm) || phone.contains(lowerSearchTerm) ||
                            department.contains(lowerSearchTerm);
                })
                .collect(Collectors.toList());
    }
}
