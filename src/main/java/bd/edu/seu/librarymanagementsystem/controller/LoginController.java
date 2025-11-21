package bd.edu.seu.librarymanagementsystem.controller;

import bd.edu.seu.librarymanagementsystem.dto.LoginRequestDTO;
import bd.edu.seu.librarymanagementsystem.service.AuthLoginService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class LoginController {

    private final AuthLoginService authLoginService;

    public LoginController(AuthLoginService authLoginService) {
        this.authLoginService = authLoginService;
    }

    @GetMapping("/login")
    public String login(Model model) {
        if (!model.containsAttribute("logindto")) {
            model.addAttribute("logindto", new LoginRequestDTO("", ""));
        }
        return "login";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute("logindto") LoginRequestDTO logindto,
            RedirectAttributes redirectAttributes) {
        boolean valid = authLoginService.validateUser(logindto.email(), logindto.password());
        if (!valid) {
            redirectAttributes.addFlashAttribute("logindto", logindto);
            redirectAttributes.addFlashAttribute("loginError", "Invalid email or password");
            return "redirect:/login?=false";
        }
        redirectAttributes.addFlashAttribute("email", logindto.email());
        redirectAttributes.addFlashAttribute("loginMessage", "Welcome " + logindto.email() + "! Login successful");
        return "redirect:/dashboard?login=true";
    }
}
