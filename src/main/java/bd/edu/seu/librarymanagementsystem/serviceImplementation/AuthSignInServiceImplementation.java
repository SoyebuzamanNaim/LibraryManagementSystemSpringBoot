package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.model.User;
import bd.edu.seu.librarymanagementsystem.service.AuthSignInService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class AuthSignInServiceImplementation implements AuthSignInService {

    private final CopyOnWriteArrayList<User> userStore = new CopyOnWriteArrayList<>();

    @Override
    public User saveUser(User user) {
        validate(user);
        if (userStore.stream().anyMatch(existing -> existing.getUsername().equalsIgnoreCase(user.getUsername()))) {
            System.out.println("Username already exists");
            return null;
        }
        if (userStore.stream().anyMatch(existing -> existing.getEmail().equalsIgnoreCase(user.getEmail()))) {
            System.out.println("Email already exists");
            return null;
        }
        userStore.add(user);
        System.out.println("User saved successfully");
        return user;
    }

    @Override
    public void deleteUser(String email) {
        if (!hasText(email)) {
            throw new IllegalArgumentException("Email must not be blank");
        }
        userStore.removeIf(user -> email.equalsIgnoreCase(user.getEmail()));
    }

    @Override
    public List<User> getAllUsers() {
        return List.copyOf(userStore);
    }

    private void validate(User user) {
        if (user == null) {
            System.out.println("User must not be null");
            return;
        }
        if (!hasText(user.getUsername())) {
            System.out.println("Username must not be blank");
            return;
        }
        if (!hasText(user.getPassword())) {
            System.out.println("Password must not be blank");
            return;
        }
        if (!hasText(user.getEmail())) {
            System.out.println("Email must not be blank");
            return;
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
