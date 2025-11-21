package bd.edu.seu.librarymanagementsystem.service;

import bd.edu.seu.librarymanagementsystem.model.User;

import java.util.List;

public interface AuthSignInService {

    User saveUser(User user);

    void deleteUser(String email);

    List<User> getAllUsers();
}
