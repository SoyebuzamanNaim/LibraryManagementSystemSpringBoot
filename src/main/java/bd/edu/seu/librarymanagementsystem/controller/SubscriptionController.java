package bd.edu.seu.librarymanagementsystem.controller;

import bd.edu.seu.librarymanagementsystem.dto.SubscriptionRequestDTO;
import bd.edu.seu.librarymanagementsystem.model.Subscription;
import bd.edu.seu.librarymanagementsystem.service.StudentService;
import bd.edu.seu.librarymanagementsystem.service.SubscriptionService;
import bd.edu.seu.librarymanagementsystem.util.RedirectUtil;
import bd.edu.seu.librarymanagementsystem.util.SessionManager;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final StudentService studentService;

    public SubscriptionController(SubscriptionService subscriptionService, StudentService studentService) {
        this.subscriptionService = subscriptionService;
        this.studentService = studentService;
    }

    @GetMapping("/subscriptions")
    public String subscriptions(@RequestParam(required = false) String search, Model model,
            HttpSession session, RedirectAttributes redirectAttributes) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        if (search != null && !search.trim().isEmpty()) {
            model.addAttribute("subscriptions", subscriptionService.searchSubscriptions(search));
            model.addAttribute("searchTerm", search);
        } else {
            model.addAttribute("subscriptions", subscriptionService.getAllSubscriptions());
        }
        model.addAttribute("students", studentService.getAllStudents());
        return "subscriptions";
    }

    @PostMapping("/subscriptions")
    public String createSubscription(@RequestParam(required = false) String active,
            @ModelAttribute SubscriptionRequestDTO requestDTO,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            Subscription subscription = new Subscription();
            subscription.setStudentId(requestDTO.studentId());
            subscription.setType(requestDTO.type());
            subscription.setStartDate(requestDTO.startDate());
            subscription.setEndDate(requestDTO.endDate());
            subscription.setActive(active != null && active.equals("on"));
            subscriptionService.saveSubscription(subscription);
            redirectAttributes.addFlashAttribute("successMessage", "Subscription created successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/subscriptions";
    }

    @PostMapping("/subscriptions/update")
    public String updateSubscription(@RequestParam String id,
            @RequestParam(required = false) String active,
            @ModelAttribute SubscriptionRequestDTO requestDTO,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            Subscription subscription = new Subscription();
            subscription.setStudentId(requestDTO.studentId());
            subscription.setType(requestDTO.type());
            subscription.setStartDate(requestDTO.startDate());
            subscription.setEndDate(requestDTO.endDate());
            subscription.setActive(active != null && active.equals("on"));
            subscriptionService.updateSubscription(id, subscription);
            redirectAttributes.addFlashAttribute("successMessage", "Subscription updated successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/subscriptions";
    }

    @PostMapping("/subscriptions/delete")
    public String deleteSubscription(@RequestParam String id,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            subscriptionService.deleteSubscription(id);
            redirectAttributes.addFlashAttribute("successMessage", "Subscription deleted successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/subscriptions";
    }
}
