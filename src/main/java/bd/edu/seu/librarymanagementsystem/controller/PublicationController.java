package bd.edu.seu.librarymanagementsystem.controller;

import bd.edu.seu.librarymanagementsystem.dto.PublicationRequestDTO;
import bd.edu.seu.librarymanagementsystem.model.Publication;
import bd.edu.seu.librarymanagementsystem.service.PublicationService;
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
public class PublicationController {

    private final PublicationService publicationService;

    public PublicationController(PublicationService publicationService) {
        this.publicationService = publicationService;
    }

    @GetMapping("/publications")
    public String publications(@RequestParam(required = false) String search, Model model,
            HttpSession session, RedirectAttributes redirectAttributes) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        if (search != null && !search.trim().isEmpty()) {
            model.addAttribute("publications", publicationService.searchPublications(search));
            model.addAttribute("searchTerm", search);
        } else {
            model.addAttribute("publications", publicationService.getAllPublications());
        }
        return "publications";
    }

    @PostMapping("/publications")
    public String createPublication(@ModelAttribute PublicationRequestDTO requestDTO,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            Publication publication = new Publication();
            publication.setName(requestDTO.name());
            publication.setAddress(requestDTO.address());
            publicationService.savePublication(publication);
            redirectAttributes.addFlashAttribute("successMessage", "Publication created successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/publications";
    }

    @PostMapping("/publications/update")
    public String updatePublication(@RequestParam String id,
            @ModelAttribute PublicationRequestDTO requestDTO,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            Publication publication = new Publication();
            publication.setName(requestDTO.name());
            publication.setAddress(requestDTO.address());
            publicationService.updatePublication(id, publication);
            redirectAttributes.addFlashAttribute("successMessage", "Publication updated successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/publications";
    }

    @PostMapping("/publications/delete")
    public String deletePublication(@RequestParam String id,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            publicationService.deletePublication(id);
            redirectAttributes.addFlashAttribute("successMessage", "Publication deleted successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/publications";
    }
}
