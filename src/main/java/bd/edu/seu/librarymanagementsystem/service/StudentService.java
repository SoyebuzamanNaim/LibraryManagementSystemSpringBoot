package bd.edu.seu.librarymanagementsystem.service;

import bd.edu.seu.librarymanagementsystem.model.Student;

import java.util.List;

public interface StudentService {
    Student saveStudent(Student student);

    Student updateStudent(String id, Student student);

    void deleteStudent(String id);

    List<Student> getAllStudents();

    Student getStudentById(String id);

    List<Student> searchStudents(String searchTerm);
}
