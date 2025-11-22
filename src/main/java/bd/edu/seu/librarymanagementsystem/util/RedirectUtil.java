package bd.edu.seu.librarymanagementsystem.util;

import org.springframework.web.servlet.mvc.support.RedirectAttributes;

public class RedirectUtil {

    private RedirectUtil() {
    }

    public static String redirectToDashboard(RedirectAttributes redirectAttributes) {
        return "redirect:/dashboard";
    }

    public static String redirectToLogin(RedirectAttributes redirectAttributes) {
        return "redirect:/login";
    }

    public static String redirectToLogin(String message, RedirectAttributes redirectAttributes) {
        redirectAttributes.addFlashAttribute("loginMessage", message);
        return "redirect:/login";
    }
}
