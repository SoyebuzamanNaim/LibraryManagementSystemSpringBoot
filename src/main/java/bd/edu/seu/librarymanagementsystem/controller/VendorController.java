package bd.edu.seu.librarymanagementsystem.controller;

import bd.edu.seu.librarymanagementsystem.dto.VendorRequestDTO;
import bd.edu.seu.librarymanagementsystem.model.Vendor;
import bd.edu.seu.librarymanagementsystem.service.VendorService;
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
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping("/vendors")
    public String vendors(@RequestParam(required = false) String search, Model model,
            HttpSession session, RedirectAttributes redirectAttributes) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        if (search != null && !search.trim().isEmpty()) {
            model.addAttribute("vendors", vendorService.searchVendors(search));
            model.addAttribute("searchTerm", search);
        } else {
            model.addAttribute("vendors", vendorService.getAllVendors());
        }
        return "vendors";
    }

    @PostMapping("/vendors")
    public String createVendor(@ModelAttribute VendorRequestDTO requestDTO,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            Vendor vendor = new Vendor();
            vendor.setName(requestDTO.name());
            vendor.setEmail(requestDTO.email());
            vendor.setPhone(requestDTO.phone());
            vendor.setAddress(requestDTO.address());
            vendorService.saveVendor(vendor);
            redirectAttributes.addFlashAttribute("successMessage", "Vendor created successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/vendors";
    }

    @PostMapping("/vendors/update")
    public String updateVendor(@RequestParam String id,
            @ModelAttribute VendorRequestDTO requestDTO,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            Vendor vendor = new Vendor();
            vendor.setName(requestDTO.name());
            vendor.setEmail(requestDTO.email());
            vendor.setPhone(requestDTO.phone());
            vendor.setAddress(requestDTO.address());
            vendorService.updateVendor(id, vendor);
            redirectAttributes.addFlashAttribute("successMessage", "Vendor updated successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/vendors";
    }

    @PostMapping("/vendors/delete")
    public String deleteVendor(@RequestParam String id,
            RedirectAttributes redirectAttributes, HttpSession session) {
        if (!SessionManager.isLoggedIn(session)) {
            return RedirectUtil.redirectToLogin(redirectAttributes);
        }
        try {
            vendorService.deleteVendor(id);
            redirectAttributes.addFlashAttribute("successMessage", "Vendor deleted successfully");
        } catch (IllegalArgumentException ex) {
            redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());
        }
        return "redirect:/vendors";
    }
}
