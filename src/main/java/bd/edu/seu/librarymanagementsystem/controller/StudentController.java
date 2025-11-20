package bd.edu.seu.librarymanagementsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StudentController {

    @GetMapping("/students")
    public String students() {
        return "students";
    }

    @GetMapping("/add-student")
    public String addStudent() {
        return "add-student";
    }

    @GetMapping("/edit-student")
    public String editStudent() {
        return "edit-student";
    }
}
