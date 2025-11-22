package bd.edu.seu.librarymanagementsystem.controller;

import bd.edu.seu.librarymanagementsystem.util.RedirectUtil;
import bd.edu.seu.librarymanagementsystem.util.SessionManager;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import jakarta.servlet.http.HttpSession;

@Controller
public class IndexController {

    @GetMapping({ "/", "/index" })
    public String index(HttpSession session, RedirectAttributes redirectAttributes) {
        if (SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToDashboard(redirectAttributes);
        } else {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
    }
}
