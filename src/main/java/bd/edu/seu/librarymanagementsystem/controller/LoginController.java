package bd.edu.seu.librarymanagementsystem.controller;

import bd.edu.seu.librarymanagementsystem.dto.LoginRequestDTO;
import bd.edu.seu.librarymanagementsystem.service.ActivityService;
import bd.edu.seu.librarymanagementsystem.service.AuthLoginService;
import bd.edu.seu.librarymanagementsystem.util.RedirectUtil;
import bd.edu.seu.librarymanagementsystem.util.SessionManager;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController {

    private final AuthLoginService authLoginService;
    private final ActivityService activityService;

    public LoginController(AuthLoginService authLoginService, ActivityService activityService) {
        this.authLoginService = authLoginService;
        this.activityService = activityService;
    }

    @GetMapping("/login")
    public String login(Model model, HttpSession session, RedirectAttributes redirectAttributes) {
        if (SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToDashboard(redirectAttributes);
        }
        if (!model.containsAttribute("logindto")) {
            model.addAttribute("logindto", new LoginRequestDTO("", ""));
        }
        return "login";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute("logindto") LoginRequestDTO logindto,
            RedirectAttributes redirectAttributes, HttpSession session) {
        boolean valid = authLoginService.validateUser(logindto.email(), logindto.password());
        if (!valid) {
            redirectAttributes.addFlashAttribute("logindto", logindto);
            redirectAttributes.addFlashAttribute("loginError", "Invalid email or password");
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        SessionManager.setEmail(session, logindto.email());
        activityService.logActivity("Login", "User logged in successfully", logindto.email());
        redirectAttributes.addFlashAttribute("email", logindto.email());
        redirectAttributes.addFlashAttribute("loginMessage", "Welcome " + logindto.email() + "! Login successful");
        return RedirectUtil.redirectToDashboard(redirectAttributes);
    }
}
