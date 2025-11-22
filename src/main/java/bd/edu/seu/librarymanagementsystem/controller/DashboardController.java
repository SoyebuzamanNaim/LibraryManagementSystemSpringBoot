package bd.edu.seu.librarymanagementsystem.controller;

import bd.edu.seu.librarymanagementsystem.dto.DashboardStatsDTO;
import bd.edu.seu.librarymanagementsystem.model.Activity;
import bd.edu.seu.librarymanagementsystem.service.ActivityService;
import bd.edu.seu.librarymanagementsystem.service.BookService;
import bd.edu.seu.librarymanagementsystem.service.DashboardService;
import bd.edu.seu.librarymanagementsystem.util.RedirectUtil;
import bd.edu.seu.librarymanagementsystem.util.SessionManager;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
public class DashboardController {

    private final DashboardService dashboardService;
    private final BookService bookService;
    private final ActivityService activityService;

    public DashboardController(DashboardService dashboardService, BookService bookService,
            ActivityService activityService) {
        this.dashboardService = dashboardService;
        this.bookService = bookService;
        this.activityService = activityService;
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model, RedirectAttributes redirectAttributes) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }

        DashboardStatsDTO stats = dashboardService.getDashboardStats();
        long availableBooks = bookService.getAllBooks().stream()
                .mapToInt(book -> book.getAvailableCopies() != null ? book.getAvailableCopies() : 0)
                .sum();
        // get recent 1000 activities
        List<Activity> recentActivities = activityService.getRecentActivities(1000);

        // System.out.println("Dashboard - Activities count: " +
        // recentActivities.size());

        model.addAttribute("stats", stats);
        model.addAttribute("availableBooks", availableBooks);
        model.addAttribute("activities", recentActivities);
        model.addAttribute("email", SessionManager.getEmail(session));
        return "dashboard";
    }
}
