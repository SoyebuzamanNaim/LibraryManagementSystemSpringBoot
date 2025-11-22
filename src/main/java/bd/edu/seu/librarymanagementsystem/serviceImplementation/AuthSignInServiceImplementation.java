package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.model.User;
import bd.edu.seu.librarymanagementsystem.service.AuthSignInService;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class AuthSignInServiceImplementation implements AuthSignInService {
    // Memory storage for users
    private final CopyOnWriteArrayList<User> userStore = new CopyOnWriteArrayList<>();

    @Override
    public User saveUser(User user) {
        validate(user);
        if (userStore.stream().anyMatch(existing -> existing.getUsername().equalsIgnoreCase(user.getUsername()))) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userStore.stream().anyMatch(existing -> existing.getEmail().equalsIgnoreCase(user.getEmail()))) {
            throw new IllegalArgumentException("Email already exists");
        }
        userStore.add(user);
        return user;
    }

    @Override
    public void deleteUser(String email) {
        if (StringUtils.isBlank(email)) {
            throw new IllegalArgumentException("Email must not be blank");
        }
        userStore.removeIf(user -> email.trim().equals(user.getEmail()));
    }

    @Override
    public List<User> getAllUsers() {
        return List.copyOf(userStore);
    }

    private void validate(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User must not be null");
        }
        if (StringUtils.isBlank(user.getUsername())) {
            throw new IllegalArgumentException("Username must not be blank");
        }
        if (StringUtils.isBlank(user.getPassword())) {
            throw new IllegalArgumentException("Password must not be blank");
        }
        if (StringUtils.isBlank(user.getEmail())) {
            throw new IllegalArgumentException("Email must not be blank");
        }
    }
}
