package bd.edu.seu.librarymanagementsystem.controller;

import bd.edu.seu.librarymanagementsystem.dto.SignInRequestDTO;
import bd.edu.seu.librarymanagementsystem.model.User;
import bd.edu.seu.librarymanagementsystem.service.AuthSignInService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class SignInController {

    private final AuthSignInService authSignInService;

    public SignInController(AuthSignInService authSignInService) {
        this.authSignInService = authSignInService;
    }

    @GetMapping("/signin")
    public String signIn(Model model) {
        if (!model.containsAttribute("signindto")) {
            model.addAttribute("signindto", new SignInRequestDTO("", "", ""));
        }
        return "signin";
    }

    @PostMapping("/signin")
    public String signIn(@ModelAttribute("signindto") SignInRequestDTO signInRequestDTO,
            RedirectAttributes redirectAttributes) {
        boolean emailExists = authSignInService.getAllUsers()
                .stream()
                .anyMatch(user -> signInRequestDTO.email() != null
                        && signInRequestDTO.email().equalsIgnoreCase(user.getEmail()));
        if (emailExists) {
            redirectAttributes.addFlashAttribute("signindto", signInRequestDTO);
            redirectAttributes.addFlashAttribute("signInError", "Email already exists");
            return "redirect:/signin";
        }
        try {
            authSignInService.saveUser(
                    new User(signInRequestDTO.username(),
                            signInRequestDTO.email(),
                            signInRequestDTO.password()));
            redirectAttributes.addFlashAttribute("loginMessage", "Account created. Please log in.");
            return "redirect:/login";
        } catch (IllegalArgumentException | IllegalStateException ex) {
            redirectAttributes.addFlashAttribute("signindto", signInRequestDTO);
            redirectAttributes.addFlashAttribute("signInError", ex.getMessage());
            return "redirect:/signin";
        }
    }
}
