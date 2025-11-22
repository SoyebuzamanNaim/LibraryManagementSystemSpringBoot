package bd.edu.seu.librarymanagementsystem.controller;

import bd.edu.seu.librarymanagementsystem.model.User;
import bd.edu.seu.librarymanagementsystem.service.AuthSignInService;
import bd.edu.seu.librarymanagementsystem.util.RedirectUtil;
import bd.edu.seu.librarymanagementsystem.util.SessionManager;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class ProfileController {

    private final AuthSignInService authSignInService;

    public ProfileController(AuthSignInService authSignInService) {
        this.authSignInService = authSignInService;
    }

    @GetMapping("/profile")
    public String profile(HttpSession session, Model model, RedirectAttributes redirectAttributes) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        String email = SessionManager.getEmail(session);
        User user = authSignInService.getAllUsers().stream()
                .filter(u -> email != null && email.equalsIgnoreCase(u.getEmail()))
                .findFirst()
                .orElse(null);

        if (user == null && email != null) {
            user = new User();
            user.setEmail(email);
            user.setUsername(email.split("@")[0]);
        }

        model.addAttribute("user", user);
        return "profile";
    }
}
