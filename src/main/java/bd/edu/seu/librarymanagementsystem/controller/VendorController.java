package bd.edu.seu.librarymanagementsystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VendorController {

    @GetMapping("/vendors")
    public String vendors() {
        return "vendors";
    }
}
