package bd.edu.seu.librarymanagementsystem.controller;

import bd.edu.seu.librarymanagementsystem.util.RedirectUtil;
import bd.edu.seu.librarymanagementsystem.util.SessionManager;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class LogoutController {

    @GetMapping("/logout")
    public String logoutGet(HttpSession session, RedirectAttributes redirectAttributes) {
        SessionManager.invalidate(session);
        return RedirectUtil.redirectToLogin("You have been logged out successfully", redirectAttributes);
    }

    @PostMapping("/logout")
    public String logoutPost(HttpSession session, RedirectAttributes redirectAttributes) {
        SessionManager.invalidate(session);
        return RedirectUtil.redirectToLogin("You have been logged out successfully", redirectAttributes);
    }
}
