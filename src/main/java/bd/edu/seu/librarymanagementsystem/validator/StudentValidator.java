package bd.edu.seu.librarymanagementsystem.validator;

import bd.edu.seu.librarymanagementsystem.model.Student;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;

public class StudentValidator {

    private StudentValidator() {
    }

    public static void validate(Student student) {
        if (student == null) {
            throw new IllegalArgumentException("Student must not be null");
        }
        if (StringUtils.isBlank(student.getName())) {
            throw new IllegalArgumentException("Student name must not be blank");
        }
        if (StringUtils.isBlank(student.getRoll())) {
            throw new IllegalArgumentException("Student roll number must not be blank");
        }
    }

    public static void validateId(String id) {
        if (StringUtils.isBlank(id)) {
            throw new IllegalArgumentException("Student ID must not be blank");
        }
    }
}
